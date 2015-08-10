'use strict';
 
var React = require('react-native');
var Firebase = require('firebase')
var myFirebaseRef = new Firebase("https://hangover.firebaseio.com/");

var {
  StyleSheet,
  Image, 
  View,
  WebView,
  Text,
  Component
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});


class Path extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Your route below: ',
      url: this.props.map
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView
        url={this.props.map} />
      </View>
    )
  }
}

module.exports = Path;
