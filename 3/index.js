function fetchData(movieid)
{
    // Fetch the initial movie on the API
    fetch(`https://api.themoviedb.org/3/movie/${movieid}?api_key=a5c1419fc47c0c9ab1b069ec31889cb4`)
        .then(response =>{
            if (!response.ok){
                throw Error("ERROR")
            }
        return response.json();
    })
    .then(data =>{
        //Show the movie title, image and release date
        const html = `
            <p> Movie Title : ${data.original_title} </p> 
            <img src="http://image.tmdb.org/t/p/w185${data.poster_path}" alt="${data.original_title} Poster Path"> 
            <p> Release date : ${data.release_date} </p>`
        document
            .querySelector("#first_movie")
            .insertAdjacentHTML("afterbegin", html);
    })
    .catch(error => {
        console.log(error);
    })
}

function submit(){
    var isIn = false;
    fname = document.getElementById("fname").value;
    //var fname = "Dwayne Johnson"
    
    fetch(`https://api.themoviedb.org/3/movie/${movieid}/credits?api_key=a5c1419fc47c0c9ab1b069ec31889cb4`)
    .then(response =>{
        if (!response.ok){
            throw Error("ERROR")
        }
    return response.json();
    })
    .then(data =>{
        let actor_picture = data.cast.map(picture =>{
            return `${picture.profile_path}`
        })
        let actor_id = data.cast.map(id =>{
            return `${id.id}`
        })
        let actors_name = data.cast.map( actors =>{
            return `${actors.name}`
        })
        
        // Get directors
        let directors = data.crew.map(directors =>{
            if (directors.known_for_department == "Directing"){
                return `${directors.name}`
            }
        })
        // push directors to actors list
        for (i=0;i<directors.length;i++){
            if (directors[i]!=undefined){
                actors_name.push(directors[i]);
            }
        }
        for (i=0; i<actors_name.length;i++){
            if (actors_name[i].toUpperCase() == fname.toUpperCase()){
                isIn = true;
                person_number = i;
            }
        }
        if (!isIn){
            var answer = '<h3 class="wrong"> WRONG ANSWER </h3>';
            document.getElementById("answer").innerHTML = "";
            document
            .querySelector("#answer")
            .insertAdjacentHTML("afterbegin", answer);
        }
        else{
            document.getElementById("answer").innerHTML = "";
            // GET ACTOR / DIRECTOR INFO
            const info = `
            <p> Full Name : ${actors_name[person_number]} </p> 
            <img src="http://image.tmdb.org/t/p/w185${actor_picture[person_number]}" alt="${actors_name[person_number]}'s profile picture">
            <form>
                    <label for="mname">Give the name of a movie where this actor/director is present: </label><br />
                    <input type="text" id="mname" name="mname" /><br />
                    <button type="button" id="second_submit">Submit</button><br />
            </form>
            `
            document
            .querySelector("#answer")
            .insertAdjacentHTML("afterbegin", info);
            document.getElementById("second_submit").onclick = function() {actorPresence()};
        }
    })
    .catch(error => {
        console.log(error);
    })
}

function actorPresence(){
    var movieName = document.getElementById("mname").value;
    movieName = encodeURIComponent(movieName)
    let movieidList = [];
    var isUsed = false;
    var isDirector = false;
    let movie_list = [];
    var isPresent = false;

    // perform movie search
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=a5c1419fc47c0c9ab1b069ec31889cb4&query=${movieName}`)
    .then(response =>{
        if (!response.ok){
            throw Error("ERROR")
        }
    return response.json();
    })
    .then(data =>{
        movie_list = data.results.map(id =>{
            return `${id.id}`
        })
        
        // If the movie is used already
        for (l = 0; l<usedMovie.length;l++){
            if (movie_list[0]==usedMovie[l]){
                isUsed = true;
            }
        }

        if (isUsed){
            //document.getElementById("answer2").innerHTML = "";
            var answer = '<h3 class="wrong"> Movie already used </h3>';
            document.getElementById("answer2").innerHTML = "";
            document
            .querySelector("#answer2")
            .insertAdjacentHTML("afterbegin", answer);
        }
        else{
            // Find list of actors directors
            fetch(`https://api.themoviedb.org/3/movie/${movie_list[0]}/credits?api_key=a5c1419fc47c0c9ab1b069ec31889cb4`)
            .then(response =>{
                if (!response.ok){
                    throw Error("ERROR")
                }
            return response.json();
            })
            .then(data =>{
                let actors_name = data.cast.map( actors =>{
                    return `${actors.name}`
                })
                
                // Get directors
                let directors = data.crew.map(directors =>{
                    if (directors.known_for_department == "Directing"){
                        return `${directors.name}`
                    }
                })
                
                // push directors to actors list
                for (i=0;i<directors.length;i++){
                    if (directors[i]!=undefined){
                        actors_name.push(directors[i]);
                    }
                }

                // Verify if our actor / director is in the list
                for (j=0;j<actors_name.length;j++)
                {
                    if (fname.toUpperCase() == actors_name[j].toUpperCase())
                    {
                        isPresent = true
                    }
                }

                if (isPresent){
                    usedMovie.push(movie_list[0]);
                    document.getElementById("answer").innerHTML = "";
                    document.getElementById("first_movie").innerHTML = "";
                    document.getElementById("answer2").innerHTML = "";
                    movieid = movie_list[0]
                    fetchData(movieid)
                }
                else{
                    var answer = '<h3 class="wrong"> WRONG ANSWER </h3>';
                    document.getElementById("answer2").innerHTML = "";
                    document
                    .querySelector("#answer2")
                    .insertAdjacentHTML("afterbegin", answer);
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        
    })
    .catch(error => {
        console.log(error);
    })
}


// Initial fetch
var movieid = 293660
var usedMovie = [movieid];
var person_number = 0;
let actor_id = [];
let actors_name = [];
let actor_picture = [];
var fname = "";
fetchData(movieid);
document.getElementById("first_submit").onclick = function() {submit()};