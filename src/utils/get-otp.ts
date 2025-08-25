const getOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 90000)

    const expirationTime = Date.now() + 2 * 60 * 1000
    return { otp, expirationTime }
}

export default getOtp