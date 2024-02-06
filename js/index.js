const token = "yy2G4hgnUsRe9BEjKIpfHHjMKCO3nj9ifdOMmHa2";
const url = "https://api.nasa.gov/mars-photos/api/v1/rovers"

const utilities = (function() {
    const date_type_str = ["earth_date", "sol"];
    const date_type_ev =  document.getElementById("date_type");
    const earth_date_ev =  document.getElementById("earth_date");
    const sol_number_ev =  document.getElementById("sol_number");
    const date_of_cam_none_ev = document.querySelectorAll(".date_of_cam_none");
    const date_of_cam_alert_ev = document.querySelectorAll(".date_of_cam_alert");
    const rover_ev =  document.getElementById("rover");
    const camera_ev =  document.getElementById("camera");
    const search_ev = document.querySelector("button.search_form_b");
    const reset_ev = document.querySelector("button.reset_form_b");
    const pic_result_ev = document.querySelector("div.pic_result");
    const save_result_ev = document.querySelector("div.save_result")
    const bad_val_gu_ev = document.querySelector("div.bad_val_gu");
    const home_page = document.querySelectorAll(".home_page");
    const save_page = document.querySelectorAll(".save_page");
    const saved_toastLive = document.getElementById('saveLiveToast');
    const delete_toastLive = document.getElementById('delLiveToast');
    const spinner = document.querySelector("div.spinner-border");
    const carousel_ev = document.querySelector("div.carousel-inner");
    const show_img_car = document.querySelectorAll(".show_img_car");
    const Hide_img_car = document.querySelectorAll(".Hide_img_car");
    const myModal = document.getElementById('secondModal');
    const error_modal_msg = document.querySelector("p.error_modal");
    const date_err = document.querySelectorAll(".date_err")

    return {
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
        myModal: myModal,
        error_modal_msg: error_modal_msg,
        date_err: date_err,
    };
})()

const page_data = (function (){
    const api_data = {}
    const search_res = {}
    const saved_photos_data = []
    const load_rovers = () => {
        for (let data = 0; data < page_data.api_data.length; ++data) {
            const new_rover_options = document.createElement("option")
            new_rover_options.value = (data+1).toString();
            new_rover_options.innerHTML = page_data.api_data[data]["name"];
            utilities.rover_ev.appendChild(new_rover_options);
        }
    }
    return{
        search_res: search_res,
        saved_photos_data: saved_photos_data,
        api_data: api_data,
        load_data: function () {
            fetch(`${url}?api_key=${token}`)
                .then((response) => response.json())
                .then((json) => {
                    page_data.api_data = json['rovers'];
                    load_rovers();
                    utilities.spinner.classList.add("d-none");
                })
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
        update_date_min_max: function (){
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
            utilities.bad_val_gu_ev.innerHTML = ``;
            utilities.bad_val_gu_ev.classList.add('d-none')
        },
        set_date_type: function (){
            utilities.date_of_cam_none_ev.forEach(date=>{
                date.classList.add('d-none');
            });
            if(utilities.date_type_ev.value !== '0')
                utilities.date_of_cam_none_ev[Number(utilities.date_type_ev.value)-1].classList.remove('d-none')
        },
        add_scope: function (data, scope_parent, first_btn, second_btn, index, first_color, second_color, class_l){
            const img = `<div class="col-12 col-sm-6 col-lg-4 text-center"><div class="card"><img src="${data["img_src"]}" class="card-img-top img-fluid d-none d-sm-block" alt="mars image"><div class="card-body"><p class="card-text">Earth date: ${data["earth_date"]}</p><p class="card-text">Sol: ${data["sol"]}</p><p class="card-text">Camera: ${data["camera"]["name"]}</p><p class="card-text">Mission: ${data["rover"]["name"]}</p><button class="btn ${first_color} ${class_l}" value="${index}">${first_btn}</button><a href="${data["img_src"]}" target="_blank" class="btn ${second_color}">${second_btn}</a></div></div></div>`
            scope_parent.innerHTML += img
        },
        save_click: function () {
            utilities.save_result_ev.innerHTML = ``
            utilities.carousel_ev.innerHTML = ``
            let index = 0;
            page_data.saved_photos_data.forEach(photo => {
                funcs.add_scope(photo, utilities.save_result_ev, "delete", "full image", (page_data.saved_photos_data.indexOf(photo).toString()), "btn-danger", "btn-primary", "del_pic")
                if(index === 0) {
                    utilities.carousel_ev.innerHTML += `<div class="carousel-item active"><img src="${photo["img_src"]}" class="d-block w-100" alt="mars image"><div class="carousel-caption d-none d-md-block"><h5>${photo["camera"]["name"]}</h5><p>${photo["earth_date"]}</p><a href="${photo["img_src"]}" target="_blank" class="btn btn-primary">Full size</a></div></div>`
                    ++index;
                }
                else
                    utilities.carousel_ev.innerHTML += `<div class="carousel-item"><img src="${photo["img_src"]}" class="d-block w-100" alt="mars image"><div class="carousel-caption d-none d-md-block"><h5>${photo["camera"]["name"]}</h5><p>${photo["earth_date"]}</p><a href="${photo["img_src"]}" target="_blank" class="btn btn-primary">Full size</a></div></div>`
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
        valid_date: function (scope, type_str){
            utilities.date_err.forEach(date_type => {
                date_type.classList.add('d-none');
            });
            if (scope.value > scope.getAttribute("max")){
                scope.value = scope.getAttribute("max");
                utilities.date_err[Number(utilities.date_type_ev.value)-1].innerHTML = `<p class="text-danger">${type_str} maximum value is ${scope.getAttribute("max")}</p>`
            } else if (scope.value !== '' && scope.value < scope.getAttribute("min")){
                scope.value = scope.getAttribute("min");
                utilities.date_err[Number(utilities.date_type_ev.value)-1].innerHTML = `<p class="text-danger">${type_str} minimum value is ${scope.getAttribute("min")}</p>`
            }
            utilities.date_err[Number(utilities.date_type_ev.value)-1].classList.remove('d-none')
        },
    }
})()

const main = (() => {
    const search_photos = function(){
        utilities.pic_result_ev.innerHTML = ``;
        let value_photo = 0;
        page_data.search_res.forEach(photo => {
            funcs.add_scope(photo, utilities.pic_result_ev, "save", "full image", (value_photo++).toString(), "btn-success", "btn-primary", "save_pic")
        });
    };
    return {
        main_func: () => {
            page_data.load_data();
            utilities.sol_number_ev.setAttribute("max", Number.MAX_SAFE_INTEGER.toString());
            console.log(Number.MAX_VALUE.toString())
            utilities.date_type_ev.addEventListener("mouseup", function () {
                funcs.set_date_type();
            });
            utilities.date_type_ev.addEventListener("keyup", function () {
                funcs.set_date_type();
            });
            utilities.rover_ev.addEventListener("mouseup", function () {
                funcs.load_cameras();
                funcs.update_date_min_max();
                funcs.valid_date(utilities.earth_date_ev, "earth date")
                funcs.valid_date(utilities.sol_number_ev, "sol number")
            });
            utilities.rover_ev.addEventListener("keyup", function () {
                funcs.load_cameras();
                funcs.update_date_min_max();
                funcs.valid_date(utilities.earth_date_ev, "earth date")
                funcs.valid_date(utilities.sol_number_ev, "sol number")
            });
            utilities.reset_ev.addEventListener("click", function () {
                funcs.reset_form();
            });
            utilities.earth_date_ev.addEventListener("mouseup", function (){
                funcs.valid_date(utilities.earth_date_ev, "earth date")
            });
            utilities.earth_date_ev.addEventListener("keyup", function (){
                funcs.valid_date(utilities.earth_date_ev, "earth date")
            });
            utilities.sol_number_ev.addEventListener("keyup", function (){
                funcs.valid_date(utilities.sol_number_ev, "sol number")
            });
            utilities.sol_number_ev.addEventListener("mouseup", function (){
                funcs.valid_date(utilities.sol_number_ev, "sol number")
            });
            utilities.search_ev.addEventListener("click", function () {
                utilities.bad_val_gu_ev.classList.add("d-none");
                if (funcs.alert_msg(utilities.date_type_ev, utilities.date_of_cam_alert_ev, utilities.bad_val_gu_ev)) {
                    utilities.bad_val_gu_ev.classList.remove("d-none")
                } else {
                    utilities.spinner.classList.remove("d-none");
                    const camera_ref = (utilities.camera_ev.value !== '0')? `&camera=${utilities.camera_ev.value}`:``;
                    fetch(`${url}/${page_data.api_data[utilities.rover_ev.value - 1]["name"]}/photos?api_key=${token}&${utilities.date_type_str[Number(utilities.date_type_ev.value) - 1]}=${utilities.date_of_cam_alert_ev[Number(utilities.date_type_ev.value) - 1].value}${camera_ref}`)
                        .then((response) => response.json())
                        .then((json) => {
                            page_data.search_res = json['photos'];
                            search_photos();
                            utilities.spinner.classList.add("d-none");
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
                utilities.save_pics = document.querySelectorAll(".save_pic")
            });
            utilities.pic_result_ev.addEventListener("click", function (event) {
                if (event.target.value) {
                    const rover_id = page_data.search_res[event.target.value]["id"];
                    if(rover_id in page_data.saved_photos_data){
                        utilities.error_modal_msg.innerHTML = `Image (id: ${rover_id}) already saved`
                        const myModal = new bootstrap.Modal(utilities.myModal)
                        myModal.show();
                    }
                    else {
                        page_data.saved_photos_data[rover_id] = page_data.search_res[event.target.value];
                        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(utilities.saved_toastLive)
                        toastBootstrap.show()
                    }
                }
            });
            utilities.save_result_ev.addEventListener("click", function (event) {
                if (event.target.value) {
                    delete page_data.saved_photos_data[event.target.value]
                    funcs.save_click()
                    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(utilities.delete_toastLive)
                    toastBootstrap.show()
                }
            });
        },
    }
})()
