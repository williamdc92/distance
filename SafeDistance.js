const axios = require('axios').default; //require npm i axios


function Distance() {

    let objects = {};
    let dimensions = {};
    const selfsubscription_key = "" //AZURE KEY

    const config = {
        headers: {
            'Ocp-Apim-Subscription-Key': selfsubscription_key
        }
    };

    const bodyParameters = {
        //url: "https://s3.envato.com/files/2a2445d3-9e57-4e4c-9f9f-2cd59c85afa1/inline_image_preview.jpg" //Safe
        // url: "https://thumbs.dreamstime.com/z/foto-di-due-persone-emozionate-e-divertenti-che-festeggiano-l-estasiata-brunetta-alla-moda-si-sono-divertite-con-qualcosa-158403361.jpg" //NotSafe
        url: "https://thumbs.dreamstime.com/b/concept-social-distancing-miniature-people-standing-distance-each-other-miniature-people-standing-distance-199538083.jpg" //Safe
        //url: "https://previews.123rf.com/images/alfastudio/alfastudio1709/alfastudio170900975/85364497-vue-arri%C3%A8re-d-un-petit-groupe-de-personnes-regardant-au-loin-et-profitant-de-la-vue-%C3%A0-l-ext%C3%A9rieur-co.jpg" 
        //url: "https://im.indiatimes.in/content/2020/Mar/Shop1_5e7ae85fa9c97.jpg?w=725&h=543"

    };

    axios.post(
            'https://NAMERESOURCE.cognitiveservices.azure.com/vision/v3.2/detect', //azure endpoint
            bodyParameters,
            config
        )
        .then(function (response) {
            objects = response.data.objects;
            dimensions = response.data.metadata;


        }).catch(function (error) {

            console.log(error);
        }).then(function () {

            let i = 0;
            let People = [];
            let otherObjects = [];

            while (i < objects.length) {
                if (objects[i].object == "person") {
                    People.push(objects[i].rectangle);
                } else {
                    otherObjects.push(objects[i].object);
                }
                i++;
            }

            console.log("----------------------------------------------------")
            console.log("I've Found " + People.length + " people" + " and " + otherObjects.length + " other Objects ");
            console.log("----------------------------------------------------")

            if (otherObjects.length > 0) {
                console.log(" List of Other Objects founded: " + otherObjects)
                console.log("----------------------------------------------------")
            };

            if (People.length > 1) {

                People.sort((people1, people2) => {
                    if (people1.x > people2.x) {
                        return 1
                    } else if (people1.x < people2.x) {
                        return -1
                    } else {
                        return 0
                    }

                })

                let c = 0;
                let numberOfPeople=1;
                let Distance = 0;
                let valueX1 = 0;
                let valueX2 = 0;
                let Reference = dimensions.width / 10;

                while (c < People.length - 1) {
                    valueX1 = People[c].x + People[c].w;
                    valueX2 = People[c + 1].x;

                    if (valueX1 > valueX2) {
                        Distance = valueX1 - valueX2;
                    } else {
                        Distance = valueX2 - valueX1;
                    }



                    console.log("Distance is " + Distance + " in a contest of " + dimensions.width);
                    console.log("----------------------------------------------------")
                    if (Distance >= Reference) console.log("Distance is SAFE between Person " + [numberOfPeople] + " and Person " + [numberOfPeople+1])
                    else console.log("Distance is NOT SAFE between Person " + [numberOfPeople] + " and Person " + [numberOfPeople+1])
                    console.log("----------------------------------------------------")
                    c++;
                    numberOfPeople++;
                } 

            }



        })

}

Distance();