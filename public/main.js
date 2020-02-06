

$(".1").on("click", async (event) => {
    let siguren = confirm("Dali ste sigurni");
    if (siguren) {
        await sendRequest($(event.target).attr("data"));
        $("#username").val("");
    }
});

let prices = $(".1");
for (var i = 0; i < prices.length; i++) {
    let price = $("<p>").html("Cena: " + $(prices[i]).attr("data") + " Ден");
    $(prices[i]).parent().append(price);
}

sendRequest = (cena) => {
    var username = $("#username").val();
    axios.patch("/api/test", {
        ime: username,
        cena: parseFloat(cena)
    })
        .then((response) => {
            let infoDiv = $("<div>").addClass("info").html(response.data).fadeIn(500);
            let okBtn = $("<button>").html("OK").on("click", (event) => {
                $(event.target).parent().css("display", "none");
            })
            infoDiv.append(okBtn);
            $("#root").append(infoDiv);
        }).catch(error => {
            if (error.response.status === 300) {
                noMoney();
            } else {
                let errorDiv = $("<div>").addClass("error-box").html(error.response.data);
                let okBtn = $("<button>").html("OK").on("click", (event) => {
                    $(event.target).parent().css("display", "none");
                })
                errorDiv.append(okBtn);
                $("#root").append(errorDiv);
            }
        });
};

let pari = $("#nemapari");


//AKO NEMA PARI
noMoney = () => {
    setTimeout(() => {
        pari.fadeIn(500);
    }, 100);

    setTimeout(() => {
        pari.fadeOut(500);
    }, 600);
}
