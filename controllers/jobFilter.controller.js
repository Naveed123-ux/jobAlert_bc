import Filter from "../models/filter.model.js";
import User from "../models/user.model.js";

export async function addFilter(req, res) {
  const { name, userId, categories, searchTerms, projectType, skills } =
    req.body;
  if (
    !name ||
    !userId ||
    categories.length === 0 ||
    searchTerms.length === 0 ||
    !projectType ||
    !skills.length === 0
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const filter = await Filter.create({
      name,
      userId,
      categories,
      searchTerms,
      projectType,
      skills,
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
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const filters = await Filter.find({ userId: userId });
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
  const { name, categories, searchTerms, projectType, skills } = req.body;
  if (
    !name ||
    categories.length === 0 ||
    searchTerms.length === 0 ||
    !projectType ||
    !skills.length === 0
  ) {
    return res.status(400).json({ message: "All fields are required" });
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
      },
      { new: true }
    );
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
