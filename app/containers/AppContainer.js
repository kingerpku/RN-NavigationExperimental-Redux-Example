'use strict'

import React, { NavigationExperimental, StyleSheet, PropTypes } from 'react-native'
import { connect } from 'react-redux'

import First from './First'
import Second from './Second'
import Third from './Third'
import { navigatePop } from '../actions'

const {
	AnimatedView: NavigationAnimatedView,
	Card: NavigationCard,
	Header: NavigationHeader
} = NavigationExperimental


class AppContainer extends React.Component {
	render() {
		return (
			// Note that we are not using a NavigationRootContainer here because Redux is handling
			// the reduction of our state for us. Instead, we grab the navigationState we have in 
			// our Redux store and pass it directly to the <NavigationAnimatedView />.
			<NavigationAnimatedView
				{...this.props}
				style={styles.outerContainer}
				renderOverlay={props => (
					// Also note that we must explicity pass <NavigationHeader /> an onNavigate prop
					// because we are no longer relying on an onNavigate function being available in
					// the context (something NavigationRootContainer would have given us).
					<NavigationHeader
						navigationProps={props}
					/>
				)}
				renderScene={props => (
					// Again, we pass our navigationState from the Redux store to <NavigationCard />.
					// Finally, we'll render out our scene based on navigationState in _renderScene().
					<NavigationCard
						{...props}
						key={props.scene.navigationState.key}
						renderScene={this._renderScene}
					/>
				)}
			/>
		)
	}

	_renderScene({scene}) {
		const { navigationState } = scene
		
		switch(navigationState.key) {
		case 'First':
			return <First />
		case 'Second':
			return <Second />
		case 'Third':
			return <Third />
		}
	}
}

AppContainer.propTypes = {
	navigationState: PropTypes.object,
	onNavigate: PropTypes.func.isRequired,
	onBack: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
	outerContainer: {
		flex: 1
	},
	container: {
		flex: 1
	}
})

export default connect(
	state => ({
		navigationState: state.navigationState
	}),
	dispatch => ({
		onNavigate: (action) => { if (action.type === 'back') { dispatch(navigatePop()) } },
		onBack: () => dispatch(navigatePop())
	})
)(AppContainer)