// ==UserScript==
// @name         Record CCI
// @namespace    http://pleasantgoat84.github.io/
// @version      0.1
// @description  try to take over the world!
// @author       PleasantGoat84
// @match        https://avalon.fun/GAME-*
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @grant        none
// ==/UserScript==

const stateApiPattern = /https:\/\/avalon\.fun\/api\/game\/GAME-.+\/state/;

console.info("Record CCI Loaded!");

$(document).ready(() => {
    setTimeout(() => {
        $(".game__game-id-container").css({
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
        });

        $(".g-tbl").css(
            "transform",
            `translateX(-50%) scale(${
        $(window).height() / ($(".g-tbl").outerHeight() + 60 * 2 + 200)
        })`
    );

      $(".g-tbl").css(
          "transform",
          `${$(".g-tbl").css("transform")} translateY(${
        ($(".g-tbl").offset().top - 90) * -1
        }px)`
    );
  }, 3 * 1000);

    $("body").append(`
    <div id="record-cci">
      <div class="tabs-container flex v" id="resultQuery">
        <div class="tabs flex">
          <span class="tab active">1</span>
          <span class="tab">2</span>
          <span class="tab">3</span>
          <span class="tab">4</span>
          <span class="tab">5</span>
        </div>
        <div class="tab-content flex v center active"></div>
        <div class="tab-content flex v center"></div>
        <div class="tab-content flex v center"></div>
        <div class="tab-content flex v center"></div>
        <div class="tab-content flex v center"></div>
      </div>
    </div>
  `);

    $("#record-cci .tab-content").append(`<table></table>`);

    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (reqData) {
        this.realSend(reqData);
        this.onload = () => {
            if (this.responseURL.match(stateApiPattern)) {
                let resp = JSON.parse(this.responseText);
                console.debug(resp);

                if ($("#record-cci .tab-content tr").length <= 1) {
                    resp.players.forEach((player) => {
                        console.debug(player.displayName);
                        $("#record-cci .tab-content table").append(
                            `<tr>
                <th>${player.displayName}</th>
                <td class="vote-result"> - </td>
                <td class="vote-result"> - </td>
                <td class="vote-result"> - </td>
                <td class="vote-result"> - </td>
                <td class="vote-result"> - </td>
              </tr>`
            );
          });
        }

          let activeQuest = resp.activeQuest;
          if (
              activeQuest.teamProposal.isApproved !== null &&
              activeQuest.teamProposal.votes[0] !== undefined
          ) {
              activeQuest.teamProposal.votes.forEach((vote) => {
                  let queryString = `#record-cci .tab-content:nth-of-type(${
              1 + activeQuest.number
            }) tr:contains("${vote.player.displayName}") td:nth-of-type(${
              activeQuest.teamProposal.isApproved
            ? resp.teamsRejectedStreak + 1
            : resp.teamsRejectedStreak
            })`;

              console.debug(queryString);

              $(queryString)
                  .removeClass("none")
                  .addClass(vote.vote.toLowerCase())
                  .text(vote.vote === "APPROVE" ? "✔" : "✘")
                  .addClass(
                  activeQuest.teamProposal.team.some(
                      (player) => player.displayName === vote.player.displayName
                  )
                  ? "chosen"
                  : ""
              );
          });

            if (activeQuest.teamProposal.isApproved) {
                $(
                    `#record-cci .tab-content:nth-of-type(${
                1 + activeQuest.number
                }) tr`
            ).each(function (row) {
                $(this)
                    .find(`.vote-result:gt(${resp.teamsRejectedStreak})`)
                    .addClass("no")
                    .text("🛇");
            });

              activeQuest.teamProposal.team.forEach((player) => {
                  $(
                      `#record-cci .tab-content:nth-of-type(${
                  1 + activeQuest.number
                  }) th:contains(${player.displayName})`
              ).addClass("chosen");
            });
          }
        }

          let queryString = `#record-cci .tab-content:lt(${
          activeQuest.number - 1
      }) td.vote-result:not(.approve, .reject, .no)`;
          console.debug(queryString);
          $(queryString).addClass("unknown").text("?");

          $(
              `#record-cci .tab-content:nth-of-type(${1 + activeQuest.number}) tr`
        ).each(function (row) {
            $(this)
                .find(
                `.vote-result:lt(${resp.teamsRejectedStreak}):not(.approve, .reject, .no)`
            )
              .addClass("unknown")
              .text("?");
        });
      }
    };
  };

    $("#record-cci .tab").on("click", (event) => {
        let targetPage = Number(event.target.innerText);
        console.log(targetPage);

        $("#record-cci .tab, #record-cci .tab-content").removeClass("active");
        $(
            `#record-cci .tab:nth-of-type(${targetPage}), #record-cci .tab-content:nth-of-type(${
        1 + targetPage
        })`
    ).addClass("active");
  });

    $("body").append(`
        <style>
          .flex {
            display: flex;
            align-items: center;
          }
          .flex.v {
            flex-direction: column;
          }
          .flex.h {
            flex-direction: row;
          }
          .flex.center {
            justify-content: center;
          }

          #record-cci, #record-cci *{
            box-sizing: border-box;
          }
          #record-cci {
            position: fixed;
            right: 60px;
            top: 1em;
            width: calc(calc(50vw - 260px) * 0.8);
            border-radius: 1em;

            z-index: 499;

            display: flex;
            flex-direction: column;
            align-items: center;
          }


          #record-cci table {
            border-collapse: collapse;
            width: 100%;
          }
          #record-cci th,
          #record-cci td {
            border: 0.15em solid #776c56;
            padding: 0.5em;
            overflow-wrap: break-word;
          }
          #record-cci th {
            background: #99948b;
          }

          #record-cci .tabs-container {
            width: 100%;
            flex: 1;
          }
          #record-cci .tabs-container > * {
            width: 100%;
          }
          #record-cci .tabs {
            align-items: flex-end;
          }
          #record-cci .tab {
            flex: 1;
            text-align: center;
            padding: 0.5em;
            border: 0.5vh solid #22201e;
            background: #413418;
            color: white;
            cursor: pointer;
            opacity: 0.75;
          }
          #record-cci .tab:first-child {
            border-top-left-radius: 0.5em;
          }
          #record-cci .tab:last-child {
            border-top-right-radius: 0.5em;
          }
          #record-cci .tab.active {
            background: #878370;
            color: white;
            font-weight: bold;
            opacity: 1;
            font-size: 1.1em;
          }
          #record-cci .tab-content {
            flex: 1;
            background: #5a4f3d;
            padding: 1em;
            border-style: solid;
            border-bottom-left-radius: 0.5em;
            border-bottom-right-radius: 0.5em;
            margin-top: -0.5vh;
            border-width: 0.5vh;

            display: none;
          }

          #record-cci .tab-content.active {
            display: block;
          }

          #record-cci .vote-result {
            color: white;
            background: #3e3d3b;
            width: 3em;
            text-align: center;
          }

          #record-cci .vote-result.approve {
            background: #63bb38;
          }
          #record-cci .vote-result.reject {
            background: #c33938;
          }
          #record-cci .vote-result.chosen {
            border: solid 0.5em #f3db31;
          }
          #record-cci th.chosen {
            color: #f3db31;
            font-weight: bold;
          }
          #record-cci .vote-result.unknown {
            background: black;
          }
          #record-cci .vote-result.no {
            background: #7a715d;
          }
        </style>
    `);
});
