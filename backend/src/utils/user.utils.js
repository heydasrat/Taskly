const publicUserObj = (user) => {
    return {
        _id: user._id.toString(),
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
        avatar: user.avatar,
        preferences: user.preferences
    }
}

export {
    publicUserObj
}