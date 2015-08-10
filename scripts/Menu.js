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
	  color: '#47474A',
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
	endButton: {
	  height: 36,
	  flex: 1,
	  flexDirection: 'row',
	  backgroundColor: '#FF3724',
	  borderColor: '#FF3724',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  justifyContent: 'center'
	},
	resetButton: {
	  height: 36,
	  flex: 1,
	  flexDirection: 'row',
	  backgroundColor: '#FFF333',
	  borderColor: '#FFF333',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  justifyContent: 'center'
	},
	storyButton: {
	  height: 36,
	  flex: 1,
	  flexDirection: 'row',
	  backgroundColor: '#1FF81B',
	  borderColor: '#1FF81B',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  justifyContent: 'center'
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
			isTracking: false,
			interval: 10
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
		}, this.state.interval * 1000)
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

	onSearchTextChanged(event) {
		let number = parseInt(event.nativeEvent.text)
	  this.setState({ interval: number });
	}

	myPath(){
		var self = this;
		this.setState({
			isLoading: true
		})
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
		      if(index === 0){
		        markers += '&markers=color:blue|label:0|'+location.lat+','+location.long
		      }
		      if(index === (mapRefs.length -1)){
		      	markers += '&markers=color:blue|label:End|'+location.lat+','+location.long
		      }
		      path += '|'+location.lat+','+location.long
		    })
		    var counts = mapRefs.reduce((obj, cur)=>{
		        var key = cur.lat + ',' + cur.long
		        if( !obj[key] ) {
		            obj[key] = 0;
		        }
		        obj[key]++;
		        return obj;
		    }, {});
		    var counter = 1;
		    for(var key in counts){
		      if(counts[key] >= 10){
		        markers += '&markers=color:blue|label:'+counter+'|'+key
		        counter ++
		      }
		    }
		    var map = "https://maps.googleapis.com/maps/api/staticmap?size=300x450"+markers+path+'&key=AIzaSyChqTqvVGjwZbF4_-wcmwUqrHnO8Y4X4Ok';
			self.setState({
				isLoading: false
			})
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
				style={styles.endButton}
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
				<TextInput
				    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
				    onChange={this.onSearchTextChanged.bind(this)}
				    value={this.state.interval}
				    keyboardType='number-pad'
				  />
				<TouchableHighlight
					style={styles.storyButton}
					underlayColor='#1FF81B'
					onPress={this.myPath.bind(this)}>
					<Text
						style={styles.buttonText}>
						My Hangover Story
					</Text>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.resetButton}
					underlayColor='#FFF333'
					onPress={this.trackReset.bind(this)}>
					<Text
						style={styles.buttonText}>
						Hangover Reset
					</Text>
				</TouchableHighlight>
				<TouchableHighlight
					style={styles.endButton}
					underlayColor='#FF3724'>
					<Text
						style={styles.buttonText}>
						A Friend is Drunk!
					</Text>
				</TouchableHighlight>
				{spinner}
			</View>
		);
	}
}

Object.assign(Menu.prototype, TimerMixin);

module.exports = Menu;