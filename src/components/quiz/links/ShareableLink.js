import React, { Component } from 'react';
import CopyButton from './CopyButton';

class ShareableLink extends Component {
  hasId() {
    return new URLSearchParams(window.location.search).get('id') !== null
  }

  buildURL() {
    return `${window.location.href}?id=${this.props.wsId}`
  }

  getURL() {
    if(this.hasId()) {
      return window.location.href
    } else if (this.props.wsId) {
      return this.buildURL()
    }
  }

  render() {
    let URL = this.getURL()
    if (URL) {
      return (
        <div className='shareable-link' style={localStyles.linkRow}>
          <div>
            Your shareable link: <p id='shareable-link'>{URL}</p>
          </div>
          <CopyButton />
        </div>
      );
    } else {
      return (
        <div></div>
      );
    };
  };
};

const localStyles = {
  linkRow: {
    display: 'flex',
    flexDirection: 'row',
    padding: '5px',
  },
}


export default ShareableLink
