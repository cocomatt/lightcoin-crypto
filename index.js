class Account {
  constructor(username) {
    this.username = username;
    this.transactions = [];
  }
  get balance() {
    let balance = 0;
    for (let t of this.transactions) {
      balance += t.value;
    }
    return balance;
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }
}

// abstract class
class Transaction {
  constructor(amount, account) {
    this.amount = amount;
    this.account = account;
  }
  commit() {
    console.log('this: ', this);
    if (!this.isAllowed()) return false;
    const transactionTime = new Date();
    transactionTime.setHours(transactionTime.getHours() - 6);
    this.time = transactionTime.toISOString().slice(0, 19);
    this.account.addTransaction(this);
    return true;
  }
}

class Deposit extends Transaction {
  get value() {
    return this.amount;
  }

  isAllowed() {
    // deposits always allowed
    return true;
  }
}

class Withdrawal extends Transaction {
  get value() {
    return -this.amount;
  }

  isAllowed() {
    // note how it has access to this.account b/c of parent
    return (this.account.balance - this.amount >= 0);
  }
}

const myAccount = new Account('scrooge');
console.log('Starting Balance: ', myAccount.balance);

console.log('Attempting to withdraw even $1 should fail...');
const t1 = new Withdrawal(1.00, myAccount);
console.log('Commit result: ', t1.commit());
console.log('Account Balance: ', myAccount.balance);

console.log('Depositing should succeed...');
const t2 = new Deposit(1155.00, myAccount);
console.log('Commit result: ', t2.commit());
console.log('Account Balance: ', myAccount.balance);

console.log('Withdrawal for $444.00 should be allowed...');
const t3 = new Withdrawal(444.00, myAccount);
console.log('Commit result: ', t3.commit());
console.log('Account Balance: ', myAccount.balance);

const t4 = new Withdrawal(345.00, myAccount);
console.log('Commit result: ', t4.commit());
console.log('Account Balance: ', myAccount.balance);

console.log('Ending Balance:', myAccount.balance);
console.log('Account Transaction History: ', myAccount.transactions);
