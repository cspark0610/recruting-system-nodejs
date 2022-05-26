type IConclusionsInd = {
  comment: string;
  context: string;
  user: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
  };
};

export default interface IConclusions {
  good: IConclusionsInd;
  bad: IConclusionsInd;
}
