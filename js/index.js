const token = "yy2G4hgnUsRe9BEjKIpfHHjMKCO3nj9ifdOMmHa2";
const url = "https://api.nasa.gov/mars-photos/api/v1/rovers"

/**
 * @namespace utilities
 * @description Contains utility functions and HTML element references for the Mars photo application.
 * @property {HTMLSelectElement} date_type_ev - Select element for choosing date type (Earth date or sol).
 * @property {HTMLInputElement} earth_date_ev - Input element for Earth date.
 * @property {HTMLInputElement} sol_number_ev - Input element for sol number.
 * @property {NodeList} date_of_cam_none_ev - NodeList of elements representing date of camera (none) display elements.
 * @property {NodeList} date_of_cam_alert_ev - NodeList of elements representing date of camera (alert) display elements.
 * @property {HTMLSelectElement} rover_ev - Select element for choosing the rover.
 * @property {HTMLSelectElement} camera_ev - Select element for choosing the camera.
 * @property {HTMLDivElement} spinner - Div element for displaying a loading spinner.
 * @property {HTMLButtonElement} search_ev - Button element for initiating the search.
 * @property {HTMLButtonElement} reset_ev - Button element for resetting the form.
 * @property {HTMLDivElement} pic_result_ev - Div element for displaying search results.
 * @property {HTMLDivElement} save_result_ev - Div element for displaying saved photos.
 * @property {HTMLDivElement} bad_val_gu_ev - Div element for displaying validation error messages.
 * @property {NodeList} home_page - NodeList of elements representing home page display elements.
 * @property {NodeList} save_page - NodeList of elements representing save page display elements.
 * @property {HTMLDivElement} saved_toastLive - Div element for displaying a live toast notification for saving a photo.
 * @property {HTMLDivElement} delete_toastLive - Div element for displaying a live toast notification for deleting a saved photo.
 * @property {HTMLDivElement} carousel_ev - Div element for displaying a photo carousel.
 * @property {NodeList} show_img_car - NodeList of elements representing show image carousel display elements.
 * @property {NodeList} Hide_img_car - NodeList of elements representing hide image carousel display elements.
 * @property {HTMLDivElement} myModal - Div element representing a modal for displaying additional information.
 * @property {HTMLParagraphElement} error_modal_msg - Paragraph element for displaying error messages in the modal.
 * @property {NodeList} date_err - NodeList of elements representing date error display elements.
 */
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

/**
 * @namespace page_data
 * @description Contains data and functions related to API data, search results, and saved photos.
 * @property {Object} api_data - Object to store API data.
 * @property {Object} search_res - Object to store search results.
 * @property {Array} saved_photos_data - Array to store saved photos data.
 * @property {Function} load_data - Fetches and loads API data.
 */
const page_data = (function (){
    const api_data = {}
    const search_res = {}
    const saved_photos_data = []

    /**
     * @function load_rover
     * @memberof page_data
     * @description Loads rover options into the rover select element.
     */
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
                .then((status)=> {
                    if (status.status >= 200 && status.status < 300) {
                        return Promise.resolve(status)
                    } else {
                        return Promise.reject(new Error(status.statusText))
                    }
                })
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

/**
 * @namespace funcs
 * @description Contains utility functions for form validation and page navigation.
 */
const funcs = (function (){
    return {
        /**
         * @function load_cameras
         * @memberof funcs
         * @description Loads cameras for the selected rover.
         */
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
        /**
         * @function update_date_min_max
         * @memberof funcs
         * @description Updates date input min and max attributes based on the selected rover.
         */
        update_date_min_max: function (){
            utilities.earth_date_ev.removeAttribute("max");
            utilities.earth_date_ev.removeAttribute("min");
            if (utilities.rover_ev.value !== '0') {
                utilities.sol_number_ev.setAttribute("max", page_data.api_data[utilities.rover_ev.value - 1]["max_sol"]);
                utilities.earth_date_ev.setAttribute("max", page_data.api_data[utilities.rover_ev.value - 1]["max_date"]);
                utilities.earth_date_ev.setAttribute("min", page_data.api_data[utilities.rover_ev.value - 1]["landing_date"]);
            }
        },
        /**
         * @function reset_form
         * @memberof funcs
         * @description Resets the search form.
         */
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
            utilities.date_err.forEach(date_type => {
                date_type.classList.add('d-none');
            });
            utilities.sol_number_ev.setAttribute("max", Number.MAX_SAFE_INTEGER.toString());
            funcs.default_date_min_max();
        },
        /**
         * @function set_date_type
         * @memberof funcs
         * @description Sets the display for date types.
         */
        set_date_type: function (){
            utilities.date_of_cam_none_ev.forEach(date=>{
                date.classList.add('d-none');
            });
            if(utilities.date_type_ev.value !== '0')
                utilities.date_of_cam_none_ev[Number(utilities.date_type_ev.value)-1].classList.remove('d-none')
        },
        /**
         * @function add_scope
         * @memberof funcs
         * @description Adds a photo scope to the HTML.
         * @param {Object} data - Photo data to be added to the HTML.
         * @param {HTMLDivElement} scope_parent - Parent element to append the photo scope.
         * @param {string} first_btn - Label for the first button.
         * @param {string} second_btn - Label for the second button.
         * @param {number} index - Index of the photo in the saved photos data.
         * @param {string} first_color - CSS class for styling the first button.
         * @param {string} second_color - CSS class for styling the second button.
         * @param {string} class_l - Additional CSS class for styling.
         */
        add_scope: function (data, scope_parent, first_btn, second_btn, index, first_color, second_color, class_l){
            const img = `<div class="col-12 col-sm-6 col-lg-4 text-center"><div class="card"><img src="${data["img_src"]}" class="card-img-top img-fluid d-none d-sm-block" alt="mars image"><div class="card-body"><p class="card-text">Earth date: ${data["earth_date"]}</p><p class="card-text">Sol: ${data["sol"]}</p><p class="card-text">Camera: ${data["camera"]["name"]}</p><p class="card-text">Mission: ${data["rover"]["name"]}</p><button class="btn ${first_color} ${class_l}" value="${index}">${first_btn}</button><a href="${data["img_src"]}" target="_blank" class="btn ${second_color}">${second_btn}</a></div></div></div>`
            scope_parent.innerHTML += img
        },
        /**
         * @function save_click
         * @memberof funcs
         * @description Displays saved photos and activates the save page.
         */
        save_click: function () {
            utilities.save_result_ev.innerHTML = ``
            utilities.carousel_ev.innerHTML = ``
            console.log(Object.keys(page_data.saved_photos_data).length)
            console.log(Object.keys(page_data.saved_photos_data))
            if (Object.keys(page_data.saved_photos_data).length === 0)
                utilities.save_result_ev.innerHTML = `<h2>No photos</h2>`;
            else {
                let index = 0;
                page_data.saved_photos_data.forEach(photo => {
                    funcs.add_scope(photo, utilities.save_result_ev, "delete", "full image", (page_data.saved_photos_data.indexOf(photo).toString()), "btn-danger", "btn-primary", "del_pic")
                    if (index === 0) {
                        utilities.carousel_ev.innerHTML += `<div class="carousel-item active"><img src="${photo["img_src"]}" class="d-block w-100" alt="mars image"><div class="carousel-caption d-none d-md-block"><h5>${photo["camera"]["name"]}</h5><p>${photo["earth_date"]}</p><a href="${photo["img_src"]}" target="_blank" class="btn btn-primary">Full size</a></div></div>`
                        ++index;
                    } else
                        utilities.carousel_ev.innerHTML += `<div class="carousel-item"><img src="${photo["img_src"]}" class="d-block w-100" alt="mars image"><div class="carousel-caption d-none d-md-block"><h5>${photo["camera"]["name"]}</h5><p>${photo["earth_date"]}</p><a href="${photo["img_src"]}" target="_blank" class="btn btn-primary">Full size</a></div></div>`
                });
            }
            utilities.home_page.forEach(home => {
                home.classList.add("d-none")
            });
            utilities.save_page.forEach(save => {
                save.classList.remove("d-none")
            });
        },
        /**
         * @function home_click
         * @memberof funcs
         * @description Resets the form and activates the home page.
         */
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
        /**
         * @function show_carousel
         * @memberof funcs
         * @description Displays the carousel.
         */
        show_carousel: function (){
            utilities.show_img_car.forEach(car => {
                car.classList.add('d-none')
            });
            utilities.Hide_img_car.forEach(car => {
                car.classList.remove('d-none')
            });
        },
        /**
         * @function hide_carousel
         * @memberof funcs
         * @description Hides the carousel.
         */
        hide_carousel: function (){
            utilities.show_img_car.forEach(car => {
                car.classList.remove('d-none')
            });
            utilities.Hide_img_car.forEach(car => {
                car.classList.add('d-none')
            });
        },
        /**
         * @function alert_msg
         * @memberof funcs
         * @description Displays alert messages for form validation.
         * @param {HTMLSelectElement} value_check_1 - First value to check.
         * @param {NodeList} value_check_2 - NodeList of values to check.
         * @param {HTMLDivElement} alert_box - Div element to display alert messages.
         * @returns {boolean} - Indicates whether an alert message was displayed.
         */
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
            if(alert_box.innerHTML !== ``)
                alert_box.innerHTML += `<br>`
            if (utilities.rover_ev.value === '0'){
                alert_box.innerHTML += `The rover must not be empty`;
                is_alert = true;
            }
            return is_alert;
        },
        /**
         * @function valid_date
         * @memberof funcs
         * @description Validates date input based on min and max values.
         * @param {HTMLInputElement} scope - Date input element to validate.
         * @param {string} type_str - Type of date input (e.g., "earth date" or "sol number").
         */
        valid_date: function (scope, type_str, is_earth){
            let date_val;
            let max_date;
            let min_date;
            if (is_earth)
            {
                date_val = new Date(scope.value)
                max_date = new Date(scope.getAttribute("max"))
                min_date = new Date(scope.getAttribute("min"))
                date_val.getTime();
                max_date.getTime();
                min_date.getTime();
            }
            else{
                date_val = scope.value;
                max_date = Number(scope.getAttribute("max"));
                min_date = Number(scope.getAttribute("min"))
            }
            utilities.date_err.forEach(date_type => {
                date_type.classList.add('d-none');
            });
            if (date_val > max_date){
                scope.value = scope.getAttribute("max");
                utilities.date_err[Number(utilities.date_type_ev.value)-1].innerHTML = `<p class="text-danger">${type_str} maximum value is ${scope.getAttribute("max")}</p>`
                utilities.date_err[Number(utilities.date_type_ev.value)-1].classList.remove('d-none')
            } else if (date_val !== '' && date_val < min_date){
                scope.value = scope.getAttribute("min");
                utilities.date_err[Number(utilities.date_type_ev.value)-1].innerHTML = `<p class="text-danger">${type_str} minimum value is ${scope.getAttribute("min")}</p>`
                utilities.date_err[Number(utilities.date_type_ev.value)-1].classList.remove('d-none')
            }
        },
        default_date_min_max: function (){
            // Get the current date
            let min_date = new Date("1000-01-01")
            let currentDate = new Date();

            // Set the minimum date to today
            let minDate = min_date.toISOString().split('T')[0];
            utilities.earth_date_ev.setAttribute("min", minDate);

            // Set the maximum date to one month from today (you can adjust the value as needed)
            let maxDate = currentDate.toISOString().split('T')[0];
            utilities.earth_date_ev.setAttribute("max", maxDate);
        },
        rover_listen: function (){
            if (utilities.rover_ev.value !== '0') {
                console.log(utilities.rover_ev.value)
                funcs.load_cameras();
                funcs.update_date_min_max();
            }
            if (utilities.date_type_ev.value === '1')
                funcs.valid_date(utilities.earth_date_ev, "earth date", true)
            else if (utilities.date_type_ev.value === '2')
                funcs.valid_date(utilities.sol_number_ev, "sol number", false)
        },
    }
})()

/**
 * @namespace main
 * @description Contains the main functionality of the Mars photo application.
 */
const main = (() => {
    /**
     * @function search_photos
     * @memberof main
     * @description Displays search results based on the fetched API data.
     */
    const search_photos = function(){
        utilities.pic_result_ev.innerHTML = ``;
        if (page_data.search_res.length === 0)
            utilities.pic_result_ev.innerHTML = `<h2>No photos</h2>`;
        else {
            let value_photo = 0;
            page_data.search_res.forEach(photo => {
                funcs.add_scope(photo, utilities.pic_result_ev, "save", "full image", (value_photo++).toString(), "btn-success", "btn-primary", "save_pic")
            });
        }
    };
    return {
        /**
         * @function main_func
         * @memberof main
         * @description Initiates the main functionality.
         */
        main_func: () => {
            page_data.load_data();
            utilities.sol_number_ev.setAttribute("max", Number.MAX_SAFE_INTEGER.toString());
            funcs.default_date_min_max();
            utilities.date_type_ev.addEventListener("mouseup", function () {
                funcs.set_date_type();
            });
            utilities.date_type_ev.addEventListener("keyup", function () {
                funcs.set_date_type();
            });
            utilities.rover_ev.addEventListener("mouseup", function () {
                funcs.rover_listen();
            });
            utilities.rover_ev.addEventListener("keyup", function () {
                funcs.rover_listen();
            });
            utilities.reset_ev.addEventListener("click", function () {
                funcs.reset_form();
            });
            utilities.earth_date_ev.addEventListener("blur", function (){
                funcs.valid_date(utilities.earth_date_ev, "earth date", true)
            });
            utilities.sol_number_ev.addEventListener("blur", function (){
                funcs.valid_date(utilities.sol_number_ev, "sol number", false)
            });
            utilities.search_ev.addEventListener("click", function () {
                utilities.bad_val_gu_ev.classList.add("d-none");
                if (funcs.alert_msg(utilities.date_type_ev, utilities.date_of_cam_alert_ev, utilities.bad_val_gu_ev)) {
                    utilities.bad_val_gu_ev.classList.remove("d-none")
                } else {
                    utilities.spinner.classList.remove("d-none");
                    const camera_ref = (utilities.camera_ev.value !== '0')? `&camera=${utilities.camera_ev.value}`:``;
                    fetch(`${url}/${page_data.api_data[utilities.rover_ev.value - 1]["name"]}/photos?api_key=${token}&${utilities.date_type_str[Number(utilities.date_type_ev.value) - 1]}=${utilities.date_of_cam_alert_ev[Number(utilities.date_type_ev.value) - 1].value}${camera_ref}`)
                        .then((status)=> {
                            if (status.status >= 200 && status.status < 300) {
                                return Promise.resolve(status)
                            } else {
                                return Promise.reject(new Error(status.statusText))
                            }
                        })
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
