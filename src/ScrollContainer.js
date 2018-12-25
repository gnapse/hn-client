import { Component } from 'preact';
import throttle from 'lodash/throttle';

class ScrollContainer extends Component {
  static defaultProps = {
    disabled: false,
    throttleDelay: 200, // milliseconds
    loadMoreOffset: 100, // pixels
  };

  setupEventHandler() {
    if (this.throttledHandler != null) {
      this.scrollContainer.removeEventListener('scroll', this.throttledHandler);
      this.throttledHandler = undefined;
    }
    if (!this.props.disabled) {
      this.throttledHandler = throttle(this.onScroll, this.props.throttleDelay);
      this.scrollContainer.addEventListener('scroll', this.throttledHandler);
      this.throttledHandler();
    }
  }

  componentDidMount() {
    this.setupEventHandler();
  }

  componentDidUpdate(oldProps) {
    if (
      oldProps.throttleDelay !== this.props.throttleDelay ||
      oldProps.disabled !== this.props.disabled
    ) {
      this.setupEventHandler();
    }
  }

  componentWillUnmount() {
    this.scrollContainer.removeEventListener('scroll', this.throttledHandler);
  }

  onScroll = () => {
    const { onLoadMore, loadMoreOffset } = this.props;
    const { scrollTop, clientHeight, scrollHeight } = this.scrollContainer;
    if (scrollTop + clientHeight >= scrollHeight - loadMoreOffset) {
      onLoadMore();
    }
  };

  render({ children, className }) {
    return (
      <div className={className} ref={node => (this.scrollContainer = node)}>
        {children}
      </div>
    );
  }
}

export { ScrollContainer };
