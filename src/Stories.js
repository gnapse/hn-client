import { Component } from 'preact';
import { fetchHN } from './api';
import { Story } from './Story';
import { ScrollContainer } from './ScrollContainer';

const PER_PAGE = 20;

class Stories extends Component {
  state = {
    storyIds: [],
    storiesById: {},
    offset: 10,
    error: false,
  };

  componentDidMount() {
    this.fetchIds();
  }

  onLoadMore = () => {
    this.setState(state => ({ offset: state.offset + PER_PAGE }));
  };

  fetchIds() {
    this.setState({ error: false });
    return fetchHN('/newstories', { force: true }).then(
      storyIds => {
        this.setState({ storyIds });
      },
      () => {
        this.setState({ error: true });
      }
    );
  }

  fetchItem = id => {
    return new Promise((resolve, reject) => {
      fetchHN(`/item/${id}`).then(
        json => {
          this.setState(
            state => ({
              storiesById: { ...state.storiesById, [id]: json },
              error: false,
            }),
            () => resolve(json)
          );
        },
        reason => {
          if (!this.state.error) {
            this.setState({ error: true });
          }
          reject(reason);
        }
      );
    });
  };

  render(_, { storyIds, storiesById, offset, error }) {
    const list = storyIds.slice(0, offset);
    const loadedCount = Object.keys(storiesById).length;
    const finishedLoading =
      storyIds.length > 0 && loadedCount >= storyIds.length;
    return (
      <ScrollContainer
        className="content"
        onLoadMore={this.onLoadMore}
        disabled={finishedLoading}
      >
        <ul class="stories">
          {list.map((storyId, index) => (
            <Story
              key={storyId}
              id={storyId}
              index={index}
              story={storiesById[storyId]}
              loadStory={this.fetchItem}
            />
          ))}
        </ul>
        {finishedLoading ? (
          <div class="the-end">No more news for you</div>
        ) : error ? (
          <div class="the-end error">Error loading stories</div>
        ) : (
          <div class="the-end">Loading stories...</div>
        )}
      </ScrollContainer>
    );
  }
}

export { Stories };
