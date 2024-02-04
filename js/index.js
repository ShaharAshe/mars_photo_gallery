const token = "yy2G4hgnUsRe9BEjKIpfHHjMKCO3nj9ifdOMmHa2";
const url = "https://api.nasa.gov/mars-photos/api/v1/rovers"

const utilities = (function() {
    const api_data = {}
    const search_res = {}
    const saved_photos = {}
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
    const home_button_ev = document.querySelector(".home_button");
    const saved_button_ev = document.querySelector(".saved_button");
    const home_page = document.querySelectorAll(".home_page");
    const save_page = document.querySelectorAll(".save_page");

    const spinner = document.querySelector(".spinner-border");

    const date_type_str = ["earth_date", "sol"];
    return {
        api_data: api_data,
        search_res: search_res,
        saved_photos: saved_photos,
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
        home_button_ev: home_button_ev,
        saved_button_ev: saved_button_ev,
        home_page: home_page,
        save_page: save_page,
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
                    console.log("camera name")
                    console.log(utilities.api_data[utilities.rover_ev.value - 1]["cameras"][camera]["name"])
                    console.log("camera name")
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

            utilities.pic_result_ev.innerHTML = ``;
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

            utilities.date_type_ev.addEventListener("keyup", function (){
                funcs.set_date_type();
            });

            utilities.rover_ev.addEventListener("mouseup", function (){
                funcs.load_cameras();
                funcs.update_date();
            });

            utilities.rover_ev.addEventListener("keyup", function (){
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
                    fetch(`${url}/${utilities.api_data[utilities.rover_ev.value-1]["name"]}/photos?api_key=${token}&${utilities.date_type_str[Number(utilities.date_type_ev.value)-1]}=${utilities.date_of_cam_alert_ev[Number(utilities.date_type_ev.value)-1].value}${camera_ref}`)
                        .then((response) => response.json())
                        .then((json) => {
                            utilities.search_res = json['photos'];
                            utilities.pic_result_ev.innerHTML = ``;
                            let value_photo = 0;
                            utilities.search_res.forEach(photo => {
                                const img = `<div class=\"col-4 text-center\">
                                                        <div class="card" style="width: 18rem;">
                                                            <img src="${photo["img_src"]}" class="card-img-top" alt="mars image">
                                                            <div class="card-body">
                                                                <p class="card-text">Earth date: ${photo["earth_date"]}</p>
                                                                <p class="card-text">Sol: ${photo["sol"]}</p>
                                                                <p class="card-text">Camera: ${photo["camera"]["name"]}</p>
                                                                <p class="card-text">Mission: ${utilities.api_data[Number(utilities.rover_ev.value)-1]["name"]}</p>
                                                                <button class="btn btn-primary save_pic" value="${(value_photo++).toString()}">save</button>
                                                                <a href="${photo["img_src"]}" target="_blank" class="btn btn-primary"">full image</a>
                                                            </div>
                                                        </div>
                                                    </div>`
                                utilities.pic_result_ev.innerHTML += img
                            });
                            utilities.spinner.classList.add("d-none");
                        })
                        // remove spinner hear
                        .catch((error) => {
                            console.log(error);
                        });
                }
                utilities.bad_val_gu_ev.innerHTML = alert_msg;

                utilities.save_pics = document.querySelectorAll(".save_pic")
            });
            utilities.pic_result_ev.addEventListener("click", function(event){
                console.log(utilities.search_res)
                if (event.target.value)
                {
                    utilities.saved_photos[utilities.search_res[event.target.value]["id"]] = utilities.search_res[event.target.value]
                }
                console.log("target")
                console.log(event.target.value)
                console.log("target")
                console.log("saved_photos")
                console.log(utilities.saved_photos)
                console.log("saved_photos")
            });

            utilities.saved_button_ev.addEventListener("click", function(event){
                utilities.home_page.forEach(home=>{
                    home.classList.add("d-none")
                });
                utilities.save_page.forEach(save=>{
                    save.classList.remove("d-none")
                });
            });

            utilities.home_button_ev.addEventListener("click", function(event){
                utilities.save_page.forEach(home=>{
                    home.classList.add("d-none")
                });
                utilities.home_page.forEach(save=>{
                    save.classList.remove("d-none")
                });

                funcs.reset_form();
            });
        },
    }
})()
