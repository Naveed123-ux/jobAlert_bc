import Filter from "../models/filter.model.js";
import User from "../models/user.model.js";
import { jobCategoryEnum } from "../constants/enum.js";
export async function addFilter(req, res) {
  const {
    name,
    categories,
    searchTerms,
    projectType,
    skills,
    minHourlyRate,
    maxHourlyRate,
    minFixedPrice,
    maxFixedPrice,
    experienceLevel,
  } = req.body;
  const { id } = req.user;
  for (const [index, no] of experienceLevel.entries()) {
    if (no === "Expert") {
      experienceLevel[index] = "3";
    } else if (no === "Intermediate") {
      experienceLevel[index] = "2";
    } else if (no === "EntryLevel" || no === "Entry Level") {
      experienceLevel[index] = "1";
    } else {
      return res.status(400).json({
        message:
          "Experience level must be one of the following: Beginner, Intermediate, Expert",
      });
    }
    if (
      !name ||
      !userId ||
      !categories?.length ||
      !searchTerms?.length ||
      !projectType ||
      !skills?.length
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
  }

  if (
    (minHourlyRate && isNaN(minHourlyRate)) ||
    (maxHourlyRate && isNaN(maxHourlyRate)) ||
    (minFixedPrice && isNaN(minFixedPrice)) ||
    (maxFixedPrice && isNaN(maxFixedPrice))
  ) {
    return res.status(400).json({ message: "Price fields must be numbers" });
  }
  if (minHourlyRate && maxHourlyRate && minHourlyRate > maxHourlyRate) {
    return res
      .status(400)
      .json({ message: "minHourlyRate cannot be greater than maxHourlyRate" });
  }

  if (minFixedPrice && maxFixedPrice && minFixedPrice > maxFixedPrice) {
    return res
      .status(400)
      .json({ message: "minFixedPrice cannot be greater than maxFixedPrice" });
  }

  if (experienceLevel && !Array.isArray(experienceLevel)) {
    return res
      .status(400)
      .json({ message: "experienceLevel must be an array" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const filter = await Filter.create({
      name,
      userId: id,
      categories,
      searchTerms,
      projectType,
      skills,
      minHourlyRate,
      maxHourlyRate,
      minFixedPrice,
      maxFixedPrice,
      experienceLevel,
    });

    return res.status(201).json({
      success: true,
      data: filter,
      message: "Filter created successfully",
    });
  } catch (error) {
    console.error("Error creating filter:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getFilters(req, res) {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const filters = await Filter.find({ userId: id });
    return res.status(200).json({
      success: true,
      data: filters,
      message: "Filters fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching filters:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
export async function updateFilter(req, res) {
  const { id } = req.params;
  const {
    name,
    categories,
    searchTerms,
    projectType,
    skills,
    minHourlyRate,
    maxHourlyRate,
    minFixedPrice,
    maxFixedPrice,
    experienceLevel,
  } = req.body;

  if (
    !name ||
    !categories?.length ||
    !searchTerms?.length ||
    !projectType ||
    !skills?.length
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (
    (minHourlyRate && isNaN(minHourlyRate)) ||
    (maxHourlyRate && isNaN(maxHourlyRate)) ||
    (minFixedPrice && isNaN(minFixedPrice)) ||
    (maxFixedPrice && isNaN(maxFixedPrice))
  ) {
    return res.status(400).json({ message: "Price fields must be numbers" });
  }

  if (minHourlyRate && maxHourlyRate && minHourlyRate > maxHourlyRate) {
    return res
      .status(400)
      .json({ message: "minHourlyRate cannot be greater than maxHourlyRate" });
  }

  if (minFixedPrice && maxFixedPrice && minFixedPrice > maxFixedPrice) {
    return res
      .status(400)
      .json({ message: "minFixedPrice cannot be greater than maxFixedPrice" });
  }
  if (experienceLevel && !Array.isArray(experienceLevel)) {
    return res
      .status(400)
      .json({ message: "experienceLevel must be an array" });
  }

  try {
    const filter = await Filter.findByIdAndUpdate(
      id,
      {
        name,
        categories,
        searchTerms,
        projectType,
        skills,
        minHourlyRate,
        maxHourlyRate,
        minFixedPrice,
        maxFixedPrice,
        experienceLevel,
      },
      { new: true }
    );

    if (!filter) {
      return res.status(404).json({ message: "Filter not found" });
    }

    return res.status(200).json({
      success: true,
      data: filter,
      message: "Filter updated successfully",
    });
  } catch (error) {
    console.error("Error updating filter:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function activateOrDeactivateFilter(req, res) {
  const { id } = req.params;
  try {
    const filter = await Filter.findOne({ _id: id });
    if (!filter)
      return res
        .status(404)
        .json({ success: false, message: "Filter not found" });
    const updatedFilter = await Filter.findByIdAndUpdate(
      id,
      {
        isActive: !filter.isActive,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: updatedFilter,
      message: "Filter updated successfully",
    });
  } catch (error) {
    console.error("Error updating filter", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function deleteFilter(req, res) {
  const { id } = req.params;
  try {
    const filter = await Filter.findByIdAndDelete(id);
    if (!filter)
      return res
        .status(404)
        .json({ success: false, message: "Filter not found" });
    res
      .status(200)
      .json({ success: true, message: "Filter deleted successfully" });
  } catch (error) {
    console.error("Error deleting filter", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
