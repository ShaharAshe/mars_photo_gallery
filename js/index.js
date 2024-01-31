const token = "yy2G4hgnUsRe9BEjKIpfHHjMKCO3nj9ifdOMmHa2";
const url = "https://api.nasa.gov/mars-photos/api/v1/rovers"
const utilities = (function() {


    return {
    };
})()

const page_data = (function (){
    const emails = {}

    return{
        emails:emails,

        load_data: function () {
            // add spinner hear
            fetch(`${url}?api_key=${token}`)
                .then((response) => response.json())
                .then((json) => {
                    for (let i = 0; i < json['rovers'].length; ++i) {
                        emails[i] = json['rovers'][i]
                    }
                    console.log("emails")
                    console.log(emails)
                    console.log("emails")

                })
                // remove spinner hear
                .catch((error) => {
                    console.log(error)
                });
        }
    }
})()


const main = ( () => {
    return {
        main_func: () => {
            console.log(token)
            page_data.load_data()
             // we should display the error to the user

            console.log(page_data.emails)

            // utilities.sub_next.addEventListener("click", function () {
            //     main.click_sub_next()
            // })
        },
    }
})()
