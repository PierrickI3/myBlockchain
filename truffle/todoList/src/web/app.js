/*****************************************/
/* Detect the MetaMask Ethereum provider */
/*****************************************/

import detectEthereumProvider from '@metamask/detect-provider';

// this returns the provider, or null if it wasn't detected
const provider = await detectEthereumProvider();

if (provider) {
  startApp(provider); // Initialize your app
} else {
  console.log('Please install MetaMask!');
}

function startApp(provider) {
  // If the provider returned by detectEthereumProvider is not the same as
  // window.ethereum, something is overwriting it, perhaps another wallet.
  if (provider !== window.ethereum) {
    console.error('Do you have multiple wallets installed?');
  }
  // Access the decentralized web!
}

/**********************************************************/
/* Handle chain (network) and chainChanged (per EIP-1193) */
/**********************************************************/

const chainId = await ethereum.request({ method: 'eth_chainId' });
handleChainChanged(chainId);

ethereum.on('chainChanged', handleChainChanged);

function handleChainChanged(_chainId) {
  // We recommend reloading the page, unless you must do otherwise
  window.location.reload();
}

/***********************************************************/
/* Handle user accounts and accountsChanged (per EIP-1193) */
/***********************************************************/

let currentAccount = null;
ethereum
  .request({ method: 'eth_accounts' })
  .then(handleAccountsChanged)
  .catch((err) => {
    // Some unexpected error.
    // For backwards compatibility reasons, if no accounts are available,
    // eth_accounts will return an empty array.
    console.error(err);
  });

// Note that this event is emitted on page load.
// If the array of accounts is non-empty, you're already
// connected.
ethereum.on('accountsChanged', handleAccountsChanged);

// For now, 'eth_accounts' will continue to always return an array
function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    // MetaMask is locked or the user has not connected any accounts
    console.log('Please connect to MetaMask.');
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    // Do any other work!
  }
}

/*********************************************/
/* Access the user's accounts (per EIP-1102) */
/*********************************************/

// You should only attempt to request the user's accounts in response to user
// interaction, such as a button click.
// Otherwise, you popup-spam the user like it's 1999.
// If you fail to retrieve the user's account(s), you should encourage the user
// to initiate the attempt.
document.getElementById('connectButton', connect);

// While you are awaiting the call to eth_requestAccounts, you should disable
// any buttons the user can click to initiate the request.
// MetaMask will reject any additional requests while the first is still
// pending.
function connect() {
  console.log('Connecting...');
  ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });
}


// App = {
//   loading: false,
//   contracts: {},

//   load: async () => {
//     await App.loadWeb3();
//     await App.loadAccount();
//     await App.loadContract();
//     await App.render();
//   },

//   // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
//   loadWeb3: async () => {
//     const provider = await detectEthereumProvider();

//     if (provider) {
//       App.web3Provider = provider;
//       startApp(provider); // initialize your app
//       web3 = new Web3(provider);
//     } else {
//       window.alert('Please install MetaMask!');
//       return;
//     }

//     // Modern dapp browsers...
//     if (provider) {
//       try {
//         // Request account access if needed
//         await ethereum.enable();
//         // Acccounts now exposed
//         web3.eth.sendTransaction({
//           /* ... */
//         });
//       } catch (error) {
//         // User denied account access...
//       }
//     }
//   },

//   loadAccount: async () => {
//     // Set the current blockchain account
//     App.account = ethereum.eth.accounts[0];
//   },

//   loadContract: async () => {
//     // Create a JavaScript version of the smart contract
//     const todoList = await $.getJSON("../build/contracts/TodoList.json");
//     App.contracts.TodoList = TruffleContract(todoList);
//     App.contracts.TodoList.setProvider(App.web3Provider);

//     // Hydrate the smart contract with values from the blockchain
//     App.todoList = await App.contracts.TodoList.deployed();
//   },

//   render: async () => {
//     // Prevent double render
//     if (App.loading) {
//       return;
//     }

//     // Update app loading state
//     App.setLoading(true);

//     // Render Account
//     $("#account").html(App.account);

//     // Render Tasks
//     await App.renderTasks();

//     // Update loading state
//     App.setLoading(false);
//   },

//   renderTasks: async () => {
//     // Load the total task count from the blockchain
//     const taskCount = await App.todoList.taskCount();
//     const $taskTemplate = $(".taskTemplate");

//     // Render out each task with a new task template
//     for (var i = 1; i <= taskCount; i++) {
//       // Fetch the task data from the blockchain
//       const task = await App.todoList.tasks(i);
//       const taskId = task[0].toNumber();
//       const taskContent = task[1];
//       const taskCompleted = task[2];

//       // Create the html for the task
//       const $newTaskTemplate = $taskTemplate.clone();
//       $newTaskTemplate.find(".content").html(taskContent);
//       $newTaskTemplate
//         .find("input")
//         .prop("name", taskId)
//         .prop("checked", taskCompleted)
//         .on("click", App.toggleCompleted);

//       // Put the task in the correct list
//       if (taskCompleted) {
//         $("#completedTaskList").append($newTaskTemplate);
//       } else {
//         $("#taskList").append($newTaskTemplate);
//       }

//       // Show the task
//       $newTaskTemplate.show();
//     }
//   },

//   createTask: async () => {
//     App.setLoading(true);
//     const content = $("#newTask").val();
//     await App.todoList.createTask(content);
//     window.location.reload();
//   },

//   toggleCompleted: async (e) => {
//     App.setLoading(true);
//     const taskId = e.target.name;
//     await App.todoList.toggleCompleted(taskId);
//     window.location.reload();
//   },

//   setLoading: (boolean) => {
//     App.loading = boolean;
//     const loader = $("#loader");
//     const content = $("#content");
//     if (boolean) {
//       loader.show();
//       content.hide();
//     } else {
//       loader.hide();
//       content.show();
//     }
//   },
// };

// $(() => {
//   $(window).load(() => {
//     App.load();
//   });
// });
