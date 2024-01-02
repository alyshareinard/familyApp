export async function load({ parent }) {
    const data = await parent()
    console.log("data in userpage +page.server", data)
    return({
        userRecord: data.userRecord
    })
}