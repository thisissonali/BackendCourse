const gfName = "MrsRandom";
const gfName2 = "MrsRandom2";
const gfName3 = "MrsRandom3";

const generateLovePercentage = () => {
    return `${~~(Math.random() * 100)}%`;
}
export default gfName;

export { gfName2, gfName3 ,generateLovePercentage};