'use strict';
 
var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var Firebase = require('firebase')
var myFirebaseRef = new Firebase("https://hangover.firebaseio.com/");
var Path = require('./Path')

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component
} = React;

var styles = StyleSheet.create({
	description: {
		marginBottom: 20,
		fontSize: 18,
		textAlign: 'center',
		color: '#656565'
	},
	container: {
		padding: 30,
		marginTop: 65,
		alignItems: 'center'
	},
  	flowRight: {
	  flexDirection: 'row',
	  alignItems: 'center',
	  alignSelf: 'stretch'
	},
	buttonText: {
	  fontSize: 18,
	  color: 'white',
	  alignSelf: 'center'
	},
	button: {
	  height: 36,
	  flex: 1,
	  flexDirection: 'row',
	  backgroundColor: '#48BBEC',
	  borderColor: '#48BBEC',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  justifyContent: 'center'
	},
	searchInput: {
	  height: 36,
	  padding: 4,
	  marginRight: 5,
	  flex: 4,
	  fontSize: 18,
	  borderWidth: 1,
	  borderColor: '#48BBEC',
	  borderRadius: 8,
	  color: '#48BBEC'
	},
	image: {
	  width: 217,
	  height: 138
	}
});

var tracking

class Menu extends Component {

	constructor(props){
		super(props),
		this.state = {
			isLoading: false,
			message: '',
			isTracking: false
		}
	}


	startTracking() {
		this.setState({
			isTracking: true,
			message: 'You are currently being tracked'
		})
		tracking = this.setInterval(()=>{
			navigator.geolocation.getCurrentPosition(location=>{
				this.setState({
					message: 'You are currently being tracked'
				})
				myFirebaseRef.push(location)},
			error => {
				this.setState({
					message: 'Location lost'
				})
			})
		}, 10000)
	}

	stopTracking() {
		this.clearInterval(tracking)
		this.setState({
			isTracking: false,
			message: 'Tracking stopped!'
		})
	}

	trackReset() {
		myFirebaseRef.remove()
		this.setState({
			message: 'Your hangover has been reset'
		})
	}

	myPath(){
		var self = this;
		myFirebaseRef.once("value", function(locations) {
	      let mapRefs = Object.keys(locations.val()).map((key)=>{
	        let lat = (locations.val()[key].coords.latitude)
	        let long = (locations.val()[key].coords.longitude)
	        let obj = {lat: lat,long: long}
	        return obj
	      })
	      	var path = '&path=color:0x0000ff|weight:5'
		    var markers = ''
		    mapRefs.forEach((location, index)=>{
		      if(index === 0 || index === (mapRefs.length -1)){
		        markers += '&markers=color:blue|label:'+index+'|'+location.lat+','+location.long
		      }
		      path += '|'+location.lat+','+location.long
		    })
		    var counts = mapRefs.reduce((obj, cur)=>{
		        if( !obj[cur] ) {
		            obj[cur] = 0;
		        }
		        obj[cur]++;
		        return obj;
		    }, {});
		    for(var key in counts){
		      if(counts[key] === 10 && key !== mapRefs[0] && key !== mapRefs[mapRefs.length-1]){
		        markers += '&markers=color:blue|label:'+mapRefs.indexOf(key)+'|'+key.lat+','+key.long
		      }
		    }
		    var map = "https://maps.googleapis.com/maps/api/staticmap?size=300x450"+markers+path+'&key=AIzaSyChqTqvVGjwZbF4_-wcmwUqrHnO8Y4X4Ok';
			self.props.navigator.push({
				title: 'My Hangover Path',
				component: Path,
				passProps: {map: map}
			})
	    }, function (errorObject) {
	      console.log("The read failed: " + errorObject.code);
	    });
	}

	render() {
		var spinner = this.state.isLoading ?
			( <ActivityIndicatorIOS
			    hidden='true'
			    size='large'/> ) :
			( <View/>);

		var tracker = !this.state.isTracking ?
			(<TouchableHighlight
				style={styles.button}
				underlayColor='#99d9f4'>
				<Text
					style={styles.buttonText}
					onPress={this.startTracking.bind(this)}>
					Begin Hangover
				</Text>
			</TouchableHighlight>) :
			(<TouchableHighlight
				style={styles.button}
				underlayColor='#FF3724'>
				<Text
					style={styles.buttonText}
					onPress={this.stopTracking.bind(this)}>
					End Hangover
				</Text>
			</TouchableHighlight>)

		return (
			<View style={styles.container}>
				<Text style={styles.description}>{this.state.message}</Text>
				{tracker}
				<TouchableHighlight
					style={styles.button}
					underlayColor='#FF3724'
					onPress={this.trackReset.bind(this)}>
					<Text
						style={styles.buttonText}>
						Hangover Reset
					</Text>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.button}
					underlayColor='#FF3724'
					onPress={this.myPath.bind(this)}>
					<Text
						style={styles.buttonText}>
						My Hangover Story
					</Text>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.button}
					underlayColor='#FF3724'>
					<Text
						style={styles.buttonText}>
						Help! I'm Drunk!
					</Text>
				</TouchableHighlight>
				{spinner}
			</View>
		);
	}
}

Object.assign(Menu.prototype, TimerMixin);

module.exports = Menu;