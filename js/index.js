const token = "yy2G4hgnUsRe9BEjKIpfHHjMKCO3nj9ifdOMmHa2";
const url = "https://api.nasa.gov/mars-photos/api/v1/rovers"

const utilities = (function() {
    const api_data = {}
    const date_type_ev =  document.getElementById("date_type");
    const earth_date_ev =  document.getElementById("earth_date");
    const sol_number_ev =  document.getElementById("sol_number");
    const date_of_cam_none_ev = document.querySelectorAll(".date_of_cam_none");
    const date_of_cam_alert_ev = document.querySelectorAll(".date_of_cam_alert");
    const rover_ev =  document.getElementById("rover");
    const camera_ev =  document.getElementById("camera");
    const search_ev = document.querySelector(".search_form_b");
    const reset_ev = document.querySelector(".reset_form_b");
    const pic_result_ev = document.querySelector(".pic_result");
    const bad_val_gu_ev = document.querySelector(".bad_val_gu");

    const spinner = document.querySelector(".spinner-border");

    const date_type_str = ["earth_date", "sol"];
    return {
        api_data: api_data,
        date_type_ev: date_type_ev,
        earth_date_ev: earth_date_ev,
        sol_number_ev: sol_number_ev,
        date_of_cam_none_ev: date_of_cam_none_ev,
        date_of_cam_alert_ev: date_of_cam_alert_ev,
        rover_ev: rover_ev,
        camera_ev: camera_ev,
        spinner: spinner,
        search_ev: search_ev,
        reset_ev: reset_ev,
        pic_result_ev: pic_result_ev,
        bad_val_gu_ev: bad_val_gu_ev,
        date_type_str: date_type_str,
    };
})()

const page_data = (function (){
    const load_rovers = () => {
        const new_rover_options = document.createElement("option")
        for (let data = 0; data < utilities.api_data.length; ++data) {
            const new_rover_options = document.createElement("option")
            new_rover_options.value = (data+1).toString();
            new_rover_options.innerHTML = utilities.api_data[data]["name"];
            console.log(utilities.api_data[data])
            utilities.rover_ev.appendChild(new_rover_options);
        }
    }
    return{
        load_data: function () {
            // add spinner hear
            fetch(`${url}?api_key=${token}`)
                .then((response) => response.json())
                .then((json) => {
                    utilities.api_data = json['rovers'];
                    console.log(utilities.api_data);
                    load_rovers();
                    utilities.spinner.classList.add("d-none");
                })
                // remove spinner hear
                .catch((error) => {
                    console.log(error);
                });
        },
    }
})()

const funcs = (function (){
    return {
        load_cameras: function () {
            while (utilities.camera_ev.childElementCount !== 1) {
                utilities.camera_ev.removeChild(utilities.camera_ev.lastChild);
            }
            if (utilities.rover_ev.value !== '0') {
                for (let camera = 0; camera < utilities.api_data[utilities.rover_ev.value - 1]["cameras"].length; ++camera) {
                    const new_camera_options = document.createElement("option");
                    new_camera_options.value = utilities.api_data[utilities.rover_ev.value - 1]["cameras"][camera]["name"];
                    new_camera_options.innerHTML = utilities.api_data[utilities.rover_ev.value - 1]["cameras"][camera]["full_name"];
                    utilities.camera_ev.appendChild(new_camera_options);
                }
            }
        },
        update_date: function (){
            utilities.sol_number_ev.removeAttribute("max");
            utilities.earth_date_ev.removeAttribute("max");
            utilities.earth_date_ev.removeAttribute("min");
            if (utilities.rover_ev.value !== '0') {
                utilities.sol_number_ev.setAttribute("max", utilities.api_data[utilities.rover_ev.value - 1]["max_sol"]);
                utilities.earth_date_ev.setAttribute("max", utilities.api_data[utilities.rover_ev.value - 1]["max_date"]);
                utilities.earth_date_ev.setAttribute("min", utilities.api_data[utilities.rover_ev.value - 1]["landing_date"]);
            }
        },
        reset_form: function (){
            utilities.date_type_ev.selectedIndex = 0;
            utilities.rover_ev.selectedIndex = 0;
            utilities.date_of_cam_none_ev.forEach(date => {
                date.classList.add('d-none');
            });
            utilities.earth_date_ev.value = "";
            utilities.sol_number_ev.value = "";

            while(utilities.camera_ev.childElementCount !== 1) {
                utilities.camera_ev.removeChild(utilities.camera_ev.lastChild);
            }
        },
        set_date_type: function (){
            utilities.date_of_cam_none_ev.forEach(date=>{
                date.classList.add('d-none');
            });
            if(utilities.date_type_ev.value !== '0')
                utilities.date_of_cam_none_ev[Number(utilities.date_type_ev.value)-1].classList.remove('d-none')
        },
    }
})()

const main = (() => {
    return {
        main_func: () => {
            page_data.load_data();
            // we should display the error to the user

            utilities.date_type_ev.addEventListener("mouseup", function (){
                funcs.set_date_type();
            });

            utilities.rover_ev.addEventListener("mouseup", function (){
                funcs.load_cameras();
                funcs.update_date();
            });

            utilities.reset_ev.addEventListener("click", function () {
                funcs.reset_form();
            });

            utilities.search_ev.addEventListener("click", function (){
                let alert_msg = ""
                utilities.bad_val_gu_ev.classList.add("d-none")
                if (utilities.date_type_ev.value === "0")
                    alert_msg += "The date type must not be empty";
                else if (!utilities.date_of_cam_alert_ev[Number(utilities.date_type_ev.value)-1].value)
                    alert_msg += "The date must not be empty";
                if (utilities.rover_ev.value === '0')
                    alert_msg += "\nThe rover must not be empty";
                if (alert_msg !== ""){
                    utilities.bad_val_gu_ev.classList.remove("d-none")
                }
                else{
                    utilities.spinner.classList.remove("d-none");
                    let camera_ref = ''
                    if (utilities.camera_ev.value !== '0')
                        camera_ref += `&camera=${utilities.camera_ev.value}`
                    fetch(`${url}/${utilities.api_data[utilities.rover_ev.value]["name"]}/photos?api_key=${token}&${utilities.date_type_str[Number(utilities.date_type_ev.value)-1]}=${utilities.date_of_cam_alert_ev[Number(utilities.date_type_ev.value)-1].value}${camera_ref}`)
                        .then((response) => response.json())
                        .then((json) => {
                            json['photos'].forEach(photo => {
                                const body_div = document.createElement("div")
                                body_div.classList.add("card-body")
                                const div_card = document.createElement("div")
                                div_card.setAttribute("style", "width: 18rem;")
                                div_card.classList.add("card")
                                const photo_l = document.createElement("img")
                                photo_l.classList.add("card-img-top")
                                photo_l.setAttribute("src", "")// img src
                                photo_l.setAttribute("alt", "")// img alt
                                const add_photo_1 = document.createElement("div");
                                const content_photo = document.createElement("p")
                                content_photo.classList.add("card-text")
                                content_photo.innerHTML = `Earth date: ${photo["earth_date"]}`
                                add_photo_1.appendChild(content_photo)
                                content_photo.innerHTML = `Sol: ${photo["sol"]}`
                                add_photo_1.appendChild(content_photo)
                                content_photo.innerHTML = `Camera: ${photo["camera"]["name"]}`
                                add_photo_1.appendChild(content_photo)
                                content_photo.innerHTML = `Mission: ${utilities.api_data[utilities.rover_ev.value]["name"]}`
                                add_photo_1.appendChild(content_photo)
                                const button_div = document.createElement("div")
                                const button_save = document.createElement("button")
                                const button_full = document.createElement("button")
                                button_save.setAttribute("type", "button")
                                button_save.classList.add("btn btn-primary")
                                button_save.innerHTML = 'save';
                                button_full.setAttribute("type", "button")
                                button_full.classList.add("btn btn-primary")
                                button_full.innerHTML = 'full size'
                                button_div.appendChild(button_save)
                                button_full.appendChild(button_full)

                                add_photo_1.appendChild(button_div)
                                body_div.appendChild(add_photo_1)
                            });
                            // "<!--div class=\"col-4 text-center\">\n" +
                            // "            <div class=\"card\" style=\"width: 18rem;\">\n" +
                            // "                <img src=\"...\" class=\"card-img-top\" alt=\"...\">\n" +
                            // "                <div class=\"card-body\">\n" +
                            // "                    <p class=\"card-text\">Some quick example text to build on the card title and make up the bulk of the card's content.</p>\n" +
                            // "                    <a href=\"#\" class=\"btn btn-primary\">Go somewhere</a>\n" +
                            // "                </div>\n" +
                            // "            </div>\n" +
                            // "        </div-->"
                            console.log(utilities.api_data);
                            utilities.spinner.classList.add("d-none");
                        })
                        // remove spinner hear
                        .catch((error) => {
                            console.log(error);
                        });
                }
                utilities.bad_val_gu_ev.innerHTML = alert_msg;
            });
        },
    }
})()
