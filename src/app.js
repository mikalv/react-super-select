var _ = require('lodash'),
    React = require('react'),
    ReactSuperSelect = require('react-super-select'),
    ExampleOptionTemplate = require('./example-option-template');

var testData = require('./test-data.js'),
    mockAjaxPerPage = 10,
    lastPage = 0;

var App = React.createClass({

  handlerExample: function(newValue) {
    console.log(newValue);
  },

  _customMarkupMapper: function(item) {
    return(
    <ExampleOptionTemplate key={item.id} option={item} />);
  },

  _simulatedAjaxFetch: function() {
    var data = _.take(testData, mockAjaxPerPage);
    // simulate a 2.5 second ajax fetch for collection data
    return {
      then: function(callback) {
        setTimeout(function() {
          callback(data);
        }, 2500);
      }
    };
  },

  _groupBy: 'size',

  _simulatedPageFetch: function(collection) {
    lastPage = lastPage + 1;
    var sliceLocation = lastPage * mockAjaxPerPage,
        data;
    if (sliceLocation < testData.length) {
      data = [];

      for (var i = sliceLocation; i < (sliceLocation + mockAjaxPerPage); i++) {
        if (testData[i]) {
          data.push(testData[i]);
        }
      }
    } else {
      data = testData;
    }

    return {
      then: function(callback) {
        var complete = ((collection.length + data.length) >= testData.length),
            pagingData = {
              collection: complete ? testData : collection.concat(data),
              complete: complete
            };
        setTimeout(function() {
          callback(pagingData);
        }, 1500);
      }
    };
  },

  render: function() {
    return (
      <div>
        <section className="r-ss-example-section">
          <h1>Basic Example</h1>
          <ReactSuperSelect placeholder="Make a Selection" searchable={true} searchPlaceholder="search" dataSource={testData} onChange={this.handlerExample} />
        </section>
        <section className="r-ss-example-section">
          <h1>Custom Template Example</h1>
          <ReactSuperSelect groupBy={this._groupBy} placeholder="Make a Selection" customClassName="your-custom-wrapper-class" multiple={true} tags={true} searchable={true} searchPlaceholder="search" onChange={this.handlerExample} customOptionTemplateFunction={this._customMarkupMapper} dataSource={testData} />
        </section>
        <section className="r-ss-example-section">
          <h1>Ajax Example</h1>
          <ReactSuperSelect placeholder="Make a Selection" tags={true} searchable={true} searchPlaceholder="filter" onChange={this.handlerExample} ajaxDataSource={this._simulatedAjaxFetch} pageFetch={this._simulatedPageFetch} />
        </section>
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
