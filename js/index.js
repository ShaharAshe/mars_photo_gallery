const token = "yy2G4hgnUsRe9BEjKIpfHHjMKCO3nj9ifdOMmHa2";
const url = "https://api.nasa.gov/mars-photos/api/v1/rovers"

const utilities = (function() {
    const search_res = {}
    const saved_photos_data = []
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
    const save_result_ev = document.querySelector(".save_result")
    const bad_val_gu_ev = document.querySelector(".bad_val_gu");
    const home_page = document.querySelectorAll(".home_page");
    const save_page = document.querySelectorAll(".save_page");
    const saved_toastLive = document.getElementById('saveLiveToast');
    const delete_toastLive = document.getElementById('delLiveToast');
    const spinner = document.querySelector(".spinner-border");
    const carousel_ev = document.querySelector(".carousel-inner");
    const show_img_car = document.querySelectorAll(".show_img_car");
    const Hide_img_car = document.querySelectorAll(".Hide_img_car");

    const date_type_str = ["earth_date", "sol"];
    return {
        search_res: search_res,
        saved_photos_data: saved_photos_data,
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
        save_result_ev:save_result_ev,
        bad_val_gu_ev: bad_val_gu_ev,
        date_type_str: date_type_str,
        home_page: home_page,
        save_page: save_page,
        saved_toastLive: saved_toastLive,
        delete_toastLive: delete_toastLive,
        carousel_ev: carousel_ev,
        show_img_car: show_img_car,
        Hide_img_car: Hide_img_car,
    };
})()

const page_data = (function (){
    const api_data = {}
    const load_rovers = () => {
        for (let data = 0; data < page_data.api_data.length; ++data) {
            const new_rover_options = document.createElement("option")
            new_rover_options.value = (data+1).toString();
            new_rover_options.innerHTML = page_data.api_data[data]["name"];
            utilities.rover_ev.appendChild(new_rover_options);
        }
    }
    return{
        api_data: api_data,
        load_data: function () {
            // add spinner hear
            fetch(`${url}?api_key=${token}`)
                .then((response) => response.json())
                .then((json) => {
                    page_data.api_data = json['rovers'];
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
                for (let camera = 0; camera < page_data.api_data[utilities.rover_ev.value - 1]["cameras"].length; ++camera) {
                    const new_camera_options = document.createElement("option");
                    new_camera_options.value = page_data.api_data[utilities.rover_ev.value - 1]["cameras"][camera]["name"];
                    new_camera_options.innerHTML = page_data.api_data[utilities.rover_ev.value - 1]["cameras"][camera]["full_name"];
                    utilities.camera_ev.appendChild(new_camera_options);
                }
            }
        },
        update_date: function (){
            utilities.sol_number_ev.removeAttribute("max");
            utilities.earth_date_ev.removeAttribute("max");
            utilities.earth_date_ev.removeAttribute("min");
            if (utilities.rover_ev.value !== '0') {
                utilities.sol_number_ev.setAttribute("max", page_data.api_data[utilities.rover_ev.value - 1]["max_sol"]);
                utilities.earth_date_ev.setAttribute("max", page_data.api_data[utilities.rover_ev.value - 1]["max_date"]);
                utilities.earth_date_ev.setAttribute("min", page_data.api_data[utilities.rover_ev.value - 1]["landing_date"]);
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
        add_scope: function (data, scope_parent, first_btn, second_btn, index, first_color, second_color, class_l){
            const img = `<div class="col-12 col-sm-6 col-lg-4 text-center">
                                                        <div class="card" style="width: 18rem;">
                                                            <img src="${data["img_src"]}" class="card-img-top img-fluid d-none d-sm-block" alt="mars image">
                                                            <div class="card-body">
                                                                <p class="card-text">Earth date: ${data["earth_date"]}</p>
                                                                <p class="card-text">Sol: ${data["sol"]}</p>
                                                                <p class="card-text">Camera: ${data["camera"]["name"]}</p>
                                                                <p class="card-text">Mission: ${data["rover"]["name"]}</p>
                                                                <button class="btn ${first_color} ${class_l}" value="${index}">${first_btn}</button>
                                                                <a href="${data["img_src"]}" target="_blank" class="btn ${second_color}">${second_btn}</a>
                                                            </div>
                                                        </div>
                                                    </div>`
            scope_parent.innerHTML += img
        },
        save_click: function () {
            utilities.save_result_ev.innerHTML = ``
            utilities.carousel_ev.innerHTML = ``
            let index = 0;
            utilities.saved_photos_data.forEach(photo => {
                funcs.add_scope(photo, utilities.save_result_ev, "delete", "full image", (utilities.saved_photos_data.indexOf(photo).toString()), "btn-danger", "btn-primary", "del_pic")

                let carousel_scope = ``
                if(index === 0) {
                    carousel_scope = `<div class="carousel-item active"><img src="${photo["img_src"]}" class="d-block w-100" alt="mars image"></div>`
                    ++index;
                }
                else
                    carousel_scope = `<div class="carousel-item"><img src="${photo["img_src"]}" class="d-block w-100" alt="mars image"></div>`

                utilities.carousel_ev.innerHTML += carousel_scope;
            });

            utilities.home_page.forEach(home => {
                home.classList.add("d-none")
            });
            utilities.save_page.forEach(save => {
                save.classList.remove("d-none")
            });
        },
        home_click: function () {
            utilities.save_page.forEach(home => {
                home.classList.add("d-none")
            });
            utilities.home_page.forEach(save => {
                save.classList.remove("d-none")
            });

            funcs.hide_carousel()
            funcs.reset_form();
        },
        show_carousel: function (){
            utilities.show_img_car.forEach(car => {
                car.classList.add('d-none')
            });
            utilities.Hide_img_car.forEach(car => {
                car.classList.remove('d-none')
            });
        },
        hide_carousel: function (){
            utilities.show_img_car.forEach(car => {
                car.classList.remove('d-none')
            });
            utilities.Hide_img_car.forEach(car => {
                car.classList.add('d-none')
            });
        },
        alert_msg: function (value_check_1, value_check_2, alert_box){
            alert_box.innerHTML = ``;
            let is_alert = false;

            if (value_check_1.value === "0") {
                alert_box.innerHTML += `The date type must not be empty`;
                is_alert = true;
            } else if (!value_check_2[Number(value_check_1.value) - 1].value){
                alert_box.innerHTML += `The date must not be empty`;
                is_alert = true;
            }
            if (utilities.rover_ev.value === '0'){
                alert_box.innerHTML += `<br>The rover must not be empty`;
                is_alert = true;
            }
            return is_alert;
        },
    }
})()

const main = (() => {
    return {
        main_func: () => {
            page_data.load_data();
            // we should display the error to the user

            utilities.date_type_ev.addEventListener("mouseup", function () {
                funcs.set_date_type();
            });

            utilities.date_type_ev.addEventListener("keyup", function () {
                funcs.set_date_type();
            });

            utilities.rover_ev.addEventListener("mouseup", function () {
                funcs.load_cameras();
                funcs.update_date();
            });

            utilities.rover_ev.addEventListener("keyup", function () {
                funcs.load_cameras();
                funcs.update_date();
            });

            utilities.reset_ev.addEventListener("click", function () {
                funcs.reset_form();
            });

            utilities.search_ev.addEventListener("click", function () {
                utilities.bad_val_gu_ev.classList.add("d-none");
                if (funcs.alert_msg(utilities.date_type_ev, utilities.date_of_cam_alert_ev, utilities.bad_val_gu_ev)) {
                    utilities.bad_val_gu_ev.classList.remove("d-none")
                } else {
                    utilities.spinner.classList.remove("d-none");
                    let camera_ref = ''

                    if (utilities.camera_ev.value !== '0')
                        camera_ref += `&camera=${utilities.camera_ev.value}`

                    fetch(`${url}/${page_data.api_data[utilities.rover_ev.value - 1]["name"]}/photos?api_key=${token}&${utilities.date_type_str[Number(utilities.date_type_ev.value) - 1]}=${utilities.date_of_cam_alert_ev[Number(utilities.date_type_ev.value) - 1].value}${camera_ref}`)
                        .then((response) => response.json())
                        .then((json) => {
                            utilities.search_res = json['photos'];
                            utilities.pic_result_ev.innerHTML = ``;
                            let value_photo = 0;

                            utilities.search_res.forEach(photo => {
                                funcs.add_scope(photo, utilities.pic_result_ev, "save", "full image", (value_photo++).toString(), "btn-success", "btn-primary", "save_pic")
                            });
                            utilities.spinner.classList.add("d-none");

                        })
                        // remove spinner hear
                        .catch((error) => {
                            console.log(error);
                        });
                }
                utilities.save_pics = document.querySelectorAll(".save_pic")
            });

            utilities.pic_result_ev.addEventListener("click", function (event) {
                if (event.target.value) {
                    utilities.saved_photos_data[utilities.search_res[event.target.value]["id"]] = utilities.search_res[event.target.value];
                    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(utilities.saved_toastLive)
                    toastBootstrap.show()
                }
            });

            utilities.save_result_ev.addEventListener("click", function (event) {
                if (event.target.value) {
                    delete utilities.saved_photos_data[event.target.value]
                    funcs.save_click()
                    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(utilities.delete_toastLive)
                    toastBootstrap.show()
                }
            });
        },
    }
})()
