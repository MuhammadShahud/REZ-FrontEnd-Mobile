import React, { Component } from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Colors } from '../../Styles';
import AuthMiddleware from '../../Store/Middleware/AuthMiddleware'
import { connect } from 'react-redux'

class index extends Component {
    state = {
        isBlock: this.props.isBlock,
        loader: false
    }

    BlockRequest = () => {
        this.setState({ loader: true }, () => {
            this.props.blockUser({ id: this.props.user_id })
                .then(() => this.setState({ loader: false, isBlock: !this.state.isBlock }))
                .catch(() => this.setState({ loader: false }))
        })
    }
    render() {
        let { name, user_id , mystyle } = this.props
        return (
            <TouchableOpacity
                disabled={this.state.loader}
                style={[styles.btn, {...mystyle}]}
                onPress={this.BlockRequest}
            >
                {this.state.loader ?
                    <ActivityIndicator size={'small'} color={Colors.WHITE} />
                    :
                    !this.state.isBlock ?
                        <Text style={styles.text}>Block {name ? name : null}</Text>
                        :
                        <Text style={styles.text}>Unblock {name ? name : null}</Text>



                }
            </TouchableOpacity>
        )
    }
};

const mapsDispatchToProps = (dispatch) => {
    return {
        blockUser: payload => dispatch(AuthMiddleware.blockUser(payload))
    }
}
const mapStateToProps = (state) => {
    return {

    }
}

export default connect(mapStateToProps, mapsDispatchToProps)(index)

const styles = StyleSheet.create({
    btn: {
        width: 200,
        height: 50,
        marginTop: 5,
        backgroundColor: Colors.BLUE,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.WHITE
    }
})
