export const calculateFairness = (data) => {
    return data.reduce((acc, curr) => acc + curr.score, 0) / data.length;
};
