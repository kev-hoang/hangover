/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Menu = require('./scripts/Menu');
var SearchPage = require('./scripts/searchPage');

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    NavigatorIOS,
    TabBarIOS,
} = React;

//defines a single style
var styles = React.StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1
  }
});

class tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'menu'
    };
  }

  render() {
    return (
      <TabBarIOS selectedTab={this.state.selectedTab}>
        <TabBarIOS.Item
          title='Home'
          selected={this.state.selectedTab === 'menu'}
          icon={ require('image!home') }
          onPress={() => {
              this.setState({
                  selectedTab: 'menu',
              });
          }}>
            <React.NavigatorIOS
              style={styles.container}
              initialRoute={{
                title: 'My Hangover',
                component: Menu,
              }}/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title='Friends'
          selected={this.state.selectedTab === 'search'}
          icon={ require('image!friends') }
          onPress={() => {
                this.setState({
                    selectedTab: 'search',
                });
          }}>
          <SearchPage/>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

// class Hangover extends React.Component {
//   render() {
//     return (
//       <React.NavigatorIOS
//         style={styles.container}
//         initialRoute={{
//           title: 'My Hangover',
//           component: Menu,
//         }}/>
//     );
//   }
// }

// AppRegistry.registerComponent('Hangover', () => Hangover);
AppRegistry.registerComponent('Hangover', () => tabs);