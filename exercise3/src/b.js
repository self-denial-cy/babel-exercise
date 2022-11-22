const fn = () => {
    console.log('this is arrow function');
};

const set = new Set();
set.add(Promise.resolve(true));

console.log([1, 2, 3, 4, 5].includes(6));

fn();
