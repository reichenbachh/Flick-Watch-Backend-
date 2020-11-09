const flickList = require("../models/flickList");

exports.getFlickList = async (req, res, next) => {
  console.log(req.params.user);
  try {
    const userflickList = await flickList.findOne({ user: req.params.user });
    if (!userflickList) {
      res.status(200).json({
        message: "no tracked movies",
      });
    }
    if (userflickList) {
      res.status(200).json({
        userflickList,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.trackFlick = async (req, res, next) => {
  try {
    let { user, payloadName, payloadData, tmdb_id } = req.body;
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
      success: true,
      message: "flick created and added",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFromFlickList = async (req, res, next) => {
  try {
    const { flick_id, type, user } = req.params;
    const userFlickList = await flickList.findOne({ user });
    if (type === "movie") {
      await userFlickList.movieList.id(flick_id).remove();
      userFlickList.save({ validateBeforeSave: false });
    }
    if (type === "show") {
      await userFlickList.showList.id(flick_id).remove();
      userFlickList.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      message: "deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.resetFlickList = async (req, res, next) => {
  try {
    console.log(req.params.id);

    let { id } = req.params;
    await flickList.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "your flick list has been reset",
    });
  } catch (error) {
    next(error);
  }
};
