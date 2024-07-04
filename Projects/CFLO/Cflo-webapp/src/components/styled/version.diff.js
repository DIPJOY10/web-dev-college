import React, { PureComponent } from "react";
import ReactDiffViewer from "react-diff-viewer";

class Diff extends PureComponent {
  constructor(props) {
    super(props);
  }

  render = () => {
    const { oldValue, newValue } = this.props;

    return (
      <ReactDiffViewer
        oldValue={oldValue}
        newValue={newValue}
        splitView={false}
      />
    );
  };
}

export default Diff;
