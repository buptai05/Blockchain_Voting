App = {
  web3Provider: null,
  contracts: {},
  accounts: "0x0",

  init: async function () {
    return await App.initWeb3();
  },

  initWeb3: async function () {
    if (typeof web3 !== 'undefined') {
      console.log("If block");
      App.web3Provider = window.ethereum;
      web3 = new Web3(window.ethereum);
      console.log(window.ethereum);
      //web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      //console.log("Maybe metamask is not setup properly");
      console.log("Else block");
    }

    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Election.json", function (election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.bindEvents();

      return App.render();
    });
  },

  bindEvents: function () {
    console.log("bindEvents");
    App.contracts.Election.deployed().then(function (instance) {
      instance
        .votedEvent(
          {},
          {
            fromBlock: 0,
            toBlock: "latest",
          }
        )
        .watch(function (error, event) {
          console.log("event triggered", event);
          // Reload when a new vote is recorded
          App.render();
        });
    });
  },

  render: function () {
    console.log("render");
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        // const accounts = web3.eth.account;
        console.log("account", account);
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      } else {
        console.log("err", err);
      }
    });

    // Load contract data
    App.contracts.Election.deployed()
      .then(function (instance) {
        electionInstance = instance;
        return electionInstance.candidatesCount();
      })
      .then(function (candidatesCount) {
        console.log("CandidateCount"+ candidatesCount);

        var candidatesResults = $("#candidatesResults");
        candidatesResults.empty();

        var candidatesSelect = $("#candidatesSelect");
        candidatesSelect.empty();

        var one = $("#one"); 
        var two = $("#two");
        var three = $("#three");

        for (var i = 1; i <= candidatesCount; i++) {
          console.log(i);
          electionInstance.candidates(i).then(function (candidate) {
            
           // console.log("candidate: ", candidate[i-1]);
          // console.log( candidate);
           var id = candidate[0];
             var name = candidate[1];
             var voteCount = candidate[2];

             console.log(id+  name+ voteCount);

             if(i === 1) {
              //document.getElementById("one").innerHTML += "<tr><td>" + voteCount +  "</td></tr>";
              console.log("here i am");
              var template = "<td>" + voteCount +  "</td>";
              $("#one").append(template);
             }
             

            //console.log(candidate);

            // Render candidate Result
            // var candidateTemplate =
            //   "<tr><th>" +
            //   id +
            //   "</th><td>" +
            //   name +
            //   "</td><td>" +
            //   voteCount +
            //   "</td></tr>";
            // candidatesResults.append(candidateTemplate);

            
            // Render candidate ballot option
            // var candidateOption =
            //   "<option value='" + id + "' >" + name + "</ option>";
            // candidatesSelect.append(candidateOption);
          });
        }
        return electionInstance.voters(App.account);
      })
      .then(function (hasVoted) {
        // Do not allow a user to vote
        if (hasVoted) {
          $("form").hide();
        }
        loader.hide();
        content.show();
      })
      .catch(function (error) {
        console.warn(error);
      });
  },

  castVote: function (candidateId) {
    // console.log(event);
    App.contracts.Election.deployed()
      .then(function (instance) {
        return instance.vote(candidateId, { from: App.account });
      })
      .then(function (result) {
        // Wait for votes to update
        $("#content").hide();
        $("#loader").show();
        // App.render()
      })
      .catch(function (err) {
        console.log(App.account);
        console.error(err);
      });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
