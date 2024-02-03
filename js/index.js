const token = "yy2G4hgnUsRe9BEjKIpfHHjMKCO3nj9ifdOMmHa2";
const url = "https://api.nasa.gov/mars-photos/api/v1/rovers"

const utilities = (function() {
    const api_data = {}
    const date_type_ev =  document.getElementById("date_type");
    const earth_date_ev =  document.getElementById("earth_date");
    const sol_number_ev =  document.getElementById("sol_number");
    const date_of_cam_ev = document.querySelectorAll(".date_of_cam");
    const rover_ev =  document.getElementById("rover");
    const camera_ev =  document.getElementById("camera");
    const search_ev = document.querySelector(".search_form_b");
    const reset_ev = document.querySelector(".reset_form_b")

    const spinner = document.querySelector(".spinner-border");
    return {
        api_data: api_data,
        date_type_ev: date_type_ev,
        earth_date_ev: earth_date_ev,
        sol_number_ev: sol_number_ev,
        date_of_cam_ev: date_of_cam_ev,
        rover_ev: rover_ev,
        camera_ev: camera_ev,
        spinner: spinner,
        search_ev: search_ev,
        reset_ev: reset_ev,
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
                    new_camera_options.value = (camera + 1).toString();
                    new_camera_options.innerHTML = utilities.api_data[utilities.rover_ev.value - 1]["cameras"][camera]["full_name"];
                    utilities.camera_ev.appendChild(new_camera_options);
                }
            }
        }
    }
})()

const main = (() => {
    return {
        main_func: () => {
            page_data.load_data()
            // we should display the error to the user

            utilities.date_type_ev.addEventListener("mouseup", function (){
                utilities.date_of_cam_ev.forEach(date=>{
                    date.classList.add('d-none');
                });
                if(utilities.date_type_ev.value !== 0)
                    utilities.date_of_cam_ev[Number(utilities.date_type_ev.value)-1].classList.remove('d-none')
            })

            utilities.rover_ev.addEventListener("mouseup", function (){
                //if ()
                funcs.load_cameras()
            })

            utilities.reset_ev.addEventListener("click", function () {
                utilities.date_type_ev.selectedIndex = 0;
                utilities.rover_ev.selectedIndex = 0;
                utilities.date_of_cam_ev.forEach(date => {
                    date.classList.add('d-none');
                });
                utilities.earth_date_ev.value = "";
                utilities.sol_number_ev.value = "";

                while(utilities.camera_ev.childElementCount !== 1) {
                    utilities.camera_ev.removeChild(utilities.camera_ev.lastChild);
                }
            })
        },
    }
})()
