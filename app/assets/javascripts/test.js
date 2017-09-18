console.log("test.js loaded");

/*
Improvements to be made
Gérer mistypes
Gérer non existences
Gérer erreurs
*/

$(function() {
    function display(type, msg) {
        console.log(type.toString().toUpperCase() + " : " + msg.toString())
    }

    var DecisionTree = {
        initial: "",
        choices: {},
        status: "",
        result: {},

        reset: function() {
            this.initial = "",
                this.choices = {},
                this.status = "",
                this.result = {}
        },

        init: function(initial, choices, status, result) {
            this.initial = initial.toString();
            this.choices = choices;
            this.status = status.toString();
            this.result = {};
            $(".choice-answer").click($.proxy(function(e) {
                e.preventDefault();
                this.progress($(e.currentTarget).data("answer").toString());
                this.display_status();
            }, this));
        },

        push_choice: function(id, detail_choice, image_choice, yes_id, no_id) {
            this.choices[id] = {
                detail: detail_choice,
                image: image_choice,
                yes: yes_id,
                no: no_id
            };
        },

        progress: function(answer) {
            display("info", "Answer = " + answer.toString() + " | Status = " + this.status)
            if (answer == "yes") {
                this.result[this.status] = answer;
                this.status = this.choices[this.status].yes;
                this.display_html();
                display("info", "New status = " + this.status);
                this.is_end();
            } else if (answer == "no") {
                this.result[this.status] = answer;
                this.status = this.choices[this.status].no;
                this.display_html();
                display("info", "New status = " + this.status);
                this.is_end();
            } else {
                display("error", "Answer not recognized");
            };
            display("info", "status = " + this.status);
        },

        is_end: function() {
            if (this.status == "end") {
                $(".choice-answer").unbind("click");
                this.write_cookie();
                return true;
            } else {
                return false;
            }
        },

        write_cookie: function(){
            console.log(this.result);
            Cookies.set("quiz-result", JSON.stringify(this.result));
            console.log(Cookies.get("quiz-result"));
        },

        display_status: function() {
            display("Status", "Status : " + this.status + " If Yes : " + this.choices[this.status].yes + " If No : " + this.choices[this.status].no);
            display("Status", "Detail : " + this.choices[this.status].detail + " Image : " + this.choices[this.status].image);
            var result_string = "";
            for (var i in this.result) {
                result_string += i + " : " + this.result[i].toString() + " | "
            }
            display("Status", "Result : " + result_string)
        },

        display_html: function() {
            $("#choice-detail").text(this.choices[this.status].detail.toString());
            var newSrc = "/assets/quiz/" + this.choices[this.status].image.toString();
            $.ajax({
                url: newSrc,
                type: "GET",
                headers: {
                    "X-TOKEN": 'xxxxx'
                }
            }).done(function() {
                $("#choice-img").attr("src", newSrc);
            }).fail(function() {
                console.log("Ajax failed");
            });
            
        },

        get_result: function() {
            if (this.is_end()) {
                return this.result;
            } else {
                display("error", "Decision Tree not complete");
            }
        }
    };

    var Timer = {
        time: 60,
        status: 0,
        interval: 1,
        color_start: 105,
        color_end: 15,
        progress: function() {
            if (this.status < this.time && this.status >= 0) {
                this.status += this.interval;
            } else {
                display("info", "timer end reached");
                clearInterval(this.loop);
            }
        },
        display_html: function() {
            var w = 100 - (this.status / this.time) * 100;
            var color = this.color_start - (this.color_start - this.color_end) * (this.status / this.time);
            //console.log(color);
            $("#timer-progress").width(w.toString() + "%");
            $("#timer-txt").text(Math.round(this.time - this.status).toString());
            $("#timer-txt").css({ left: 100 - w.toString() + "%" })
            $("#timer-progress").css("background-color", "hsl(" + Math.round(color) + ", 100%, 50%)")
        },
        info: function() {
            display("info", "Status: " + this.status.toString() + " | Time: " + this.time.toString() + " | Interval: " + this.interval.toString() + " | Ratio: " + ((this.status / this.time) * 100).toString() + "%");
        },
        play: function() {
            var timer_used = this;
            var loop = setInterval(function() {
                timer_used.progress();
                timer_used.display_html();
                //timer_used.info();
                if (timer_used.status >= timer_used.time) {
                    clearInterval(loop);
                    timer_used.info();
                }
            }, this.interval * 1000);
        }
    };



    var sport_tree = Object.create(DecisionTree);
    var sport_choices = {
        "sport": {
            detail: "Faites-vous régulièrement du sport?",
            image: "sport.png",
            yes: "sport-co",
            no: "sport-proposition"
        },
        "sport-co": {
            detail: "Faites-vous plutôt du sport en équipe?",
            image: "sport-co.png",
            yes: "football",
            no: "squash"
        },
        "sport-proposition": {
            detail: "Souhaitez-vous trouver qqun pour vous motiver à faire du sport ?",
            image: "sport-ami.png",
            yes: "sport-co",
            no: "end"
        },
        "football": {
            detail: "Pratiquez-vous le Football ?",
            image: "foot.png",
            yes: "end",
            no: "end"
        },
        "squash": {
            detail: "Pratiquez-vous le Squash ?",
            image: "squash.png",
            yes: "end",
            no: "end"
        },
        "end": {
            detail: "Merci d'avoir participé au quiz, cliquez sur l'une des flèches pour vous inscrire et découvrir ce que nous vous réservons",
            image: "end.png",
            yes: "end",
            no: "end"
        }
    };
    var sport_initial = "sport";
    var sport_result = {};
    var sport_status = "sport";

    var timer_test = Object.create(Timer);
    timer_test.time = 180;
    timer_test.interval = 0.01;
    timer_test.status = 0;

    $('.choice-answer').click(function(e) {
        e.preventDefault();
        $('.choice-answer').unbind("click");
        sport_tree.init(sport_initial, sport_choices, sport_status, sport_result);
        sport_tree.display_html();
        timer_test.play();
    });
});