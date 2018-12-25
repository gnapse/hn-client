import { Component } from 'preact';

function formatDate(unixTime) {
  const date = new Date(unixTime * 1000);
  const dateStr = date.toLocaleDateString();
  const timeStr = date.toLocaleTimeString();
  return `${dateStr} - ${timeStr}`;
}

class Story extends Component {
  componentDidMount() {
    const { id, loadStory } = this.props;
    loadStory(id).catch(reason => {
      console.error(`Failed to fetch story ${id}`, reason);
    });
  }

  render({ story, index }) {
    if (!story) return null;
    return (
      <li>
        ({index + 1}){' '}
        <a target="_blank" rel="nofollow noopener noreferrer" href={story.url}>
          {story.title}
        </a>
        <div>by {story.by}</div>
        <time>{formatDate(story.time)}</time>
      </li>
    );
  }
}

export { Story };
