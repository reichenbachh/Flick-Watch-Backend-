const flickList = require("../models/flickList");

exports.trackFlick = async (req, res, next) => {
  try {
    let { user, payloadName, payloadData } = req.body;
    //check if user already has a list of tracked flicks
    const listExists = await flickList.findOne({ user });

    // if  user has no list create one and push data unto array
    if (!listExists && payloadName === "show") {
      let newList = await flickList.create({ user, showList: payloadData });
    } else if (!listExists && payloadName === "movie") {
      let newList = await flickList.create({ user, movieList: payloadData });
    }

    if (listExists && payloadName === "show") {
      listExists.showList.push(payloadData);
      listExists.save({ validateBeforeSave: false });
    } else if (listExists && payloadName === "movie") {
      listExists.movieList.push(payloadData);
      listExists.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      message: "sucess",
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      error,
    });
  }
};
