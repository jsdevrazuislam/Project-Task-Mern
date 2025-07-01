function findSecondLargeNumberInArray(arr){
    let result = arr.reduce(([max, second], current) => {

        if(current > max) return [current, max]

        return [max, second]

    }, [-Infinity, -Infinity])

    return result[1]
}

console.log(findSecondLargeNumberInArray([4, 2, 7, 1, 9]))