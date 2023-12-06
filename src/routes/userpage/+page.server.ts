export async function load({ parent }) {
    const data = await parent()
    console.log("data in userpage", data)
    return(data)
}