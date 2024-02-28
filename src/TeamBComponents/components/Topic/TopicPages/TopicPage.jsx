/* eslint-disable react/prop-types */
//2/2/2024 junite, develop edit page
//2/3/2024 junite, continuation of development, completed
//2/13-15/2024 junite, API Functionalities

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackCircle, IoArrowForwardCircle } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";

import { MdDelete } from "react-icons/md";

import DeleteTopicModal from "../TopicModal/DeleteTopicModal";
import AddTopic from "./AddTopic";
import EditTopic from "./EditTopic";
import CourseDescription from "./CourseDescription";
import Nav from "../../NavBar/Nav";
import { CourseContext } from "../../context/CourseContext";
import axios from "axios";
import Footer from "../../Footer";
import DeleteAllTopics from "../TopicModal/DeleteAllTopics";

const TopicPage = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const { courses, setCourses, chapters, setChapters } =
    useContext(CourseContext);

  //user params to navigate specific id
  let { id } = useParams();

  useEffect(() => {
    loadChapters();
    loadCourses();
  }, [id]);

  const loadChapters = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/v1/auth/chapter/${id}`
      );

      // Ensure that result.data is always an array by converting it
      const coursesArray = Array.isArray(result.data)
        ? result.data
        : [result.data];
      setChapters(coursesArray);
    } catch (error) {
      console.error("Error loading chapters:", error);
    }
  };

  const loadCourses = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/v1/auth/byChapter/${id}`
      );

      // Ensure that result.data is always an array by converting it
      const coursesArray = Array.isArray(result.data)
        ? result.data
        : [result.data];
      setCourses(coursesArray);
    } catch (error) {
      console.error("Error loading chapters:", error);
    }
  };

  //delete modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  //course description state
  const [showCourseDescription, setShowCourseDescription] = useState(true);

  //add topic state
  const [showAddTopic, setShowAddTopic] = useState(false);

  //edit topic state
  const [showEditTopic, setShowEditTopic] = useState(false);

  //functions for showing and hiding description, add topic, and edit topic

  const showDescriptionHandle = () => {
    setShowCourseDescription(true);
    setShowAddTopic(false);
    setShowEditTopic(false);
    setSideBarShow(false);
  };
  const showAddHandle = () => {
    setShowAddTopic(true);
    setShowCourseDescription(false);
    setSideBarShow(false);
    setShowEditTopic(false);
  };

  const showEditHandle = () => {
    setShowEditTopic(true);
    setShowCourseDescription(false);
    setSideBarShow(false);
    setShowAddTopic(false);
  };

  const [editTopicId, setEditTopicId] = useState(null);

  const deleteTopic = async (topicId) => {
    const deleteById = await axios.delete(
      `http://localhost:8080/api/v1/auth/topic/${topicId}`
    );
    setChapters(deleteById.data);
  };

  //for sm sidebar react state
  const [sideBarShow, setSideBarShow] = useState(false);
  const [deleteTopicTitle, setDeleteTopicTitle] = useState(null);

  const deleteAllTopics = async () => {
    try {
      // Iterate over all chapters
      for (const chap of chapters) {
        const { topic } = chap;
        // Iterate over all topics in the chapter
        for (const tops of topic) {
          const { topic_id } = tops;
          // Send delete request for each topic
          await axios.delete(
            `http://localhost:8080/api/v1/auth/topic/${topic_id}`
          );
        }
      }
      // After deleting all topics, you may want to reload the chapters
      loadChapters();
    } catch (error) {
      console.error("Error deleting topics:", error);
    }
  };

  // const [showDeleteAllTopics, setShowDeleteAllTopics] = useState(false);
  return (
    <>
      <Nav />
      <div className="flex mt-[80px] h-[170vh] md:h-[100vh]">
        {/* sidebar for md */}
        <div className="h-full hidden md:flex flex-col items-center lg:w-[250px]  bg-[#126912]">
          <div
            className="flex justify-start  pt-3 pb-8 cursor-pointer w-[90%]"
            onClick={goBack}>
            <span className="text-[2.1rem] text-white">
              <IoArrowBackCircle />
            </span>
          </div>
          <div className="hidden lg:flex lg:border-b lg:border-white w-[90%] "></div>

          <div className="h-[70%] w-[80%] ">
            <div>
              <p
                className="cursor-pointer font-light pb-3 text-white TeamB_text-shadow text-[1.3rem] "
                onClick={showDescriptionHandle}>
                Description
              </p>
            </div>
            {/* <div
              className="flex justify-center w-full px-2 py-1 mb-2 bg-red-500 rounded-md cursor-pointer lg:justify-between text-red"
              onClick={() => setShowDeleteAllTopics((prev) => !prev)}>
              <p className="text-white md:hidden lg:flex">Delete All Topics</p>
              <button className="text-[1.5rem]">
                <MdDelete />
              </button>
            </div> */}
{/* 
            {showDeleteAllTopics && (
              <div className="fixed inset-0 z-10 flex items-center justify-center">
                <div className="w-full">
                  <DeleteAllTopics
                    deleteByAllTopics={deleteAllTopics}
                    showDeleteAllTopics={setShowDeleteAllTopics}
                  />
                </div>
              </div>
            )} */}
            <div className="h-[40vh] overflow-auto TeamB_no-scrollbar pr-3">
              {chapters.map((chap, idx) => {
                const { topic } = chap;
                console.log(chap);
                return (
                  <div key={idx}>
                    {topic.map((tops, idx) => {
                      const { topic_title, topic_id } = tops;
                      console.log(tops);
                      return (
                        <div key={idx}>
                          <div className="flex items-center justify-between">
                            <p
                              className=" line-clamp-1 cursor-pointer py-1 font-light text-white TeamB_text-shadow  text-[1.2rem]"
                              onClick={() => {
                                showEditHandle();
                                setEditTopicId(topic_id);
                              }}>
                              {topic_title}
                            </p>

                            <span
                              className="text-[1.5rem] text-white cursor-pointer"
                              onClick={() => {
                                setDeleteModalVisible((prev) => !prev);
                                setDeleteTopicTitle(topic_id);
                              }}>
                              <MdDelete />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div
              className="flex items-center justify-center h-[30%] "
              onClick={showAddHandle}>
              <div className="text-white text-[4rem] md:text-[2.5rem] lg:text-[2rem] pr-2 cursor-pointer">
                <IoIosAddCircle />
              </div>
              <span className="hidden lg:flex font-medium text-white cursor-pointer text-[1rem]">
                Add New Topic
              </span>
            </div>
          </div>
        </div>

        {/* sidebar for sm */}
        {sideBarShow ? (
          <div className="fixed md:hidden z-20 flex justify-start  pt-3  cursor-pointer w-[90%]">
            <span
              className="text-[2.1rem] text-white"
              onClick={() => setSideBarShow((prev) => !prev)}>
              <IoArrowBackCircle />
            </span>
          </div>
        ) : (
          <div className="fixed z-20 md:hidden flex justify-start  pt-3  cursor-pointer w-[90%]">
            <span
              className="text-[2.1rem] text-black"
              onClick={() => setSideBarShow((prev) => !prev)}>
              <IoArrowForwardCircle />
            </span>
          </div>
        )}
        {sideBarShow && (
          <div className="h-full fixed z-10 md:hidden flex-col items-center w-[70%] bg-[#126912] rounded-r-lg">
            <div className="h-[70%] w-[1005] mt-[60px] pl-2">
              <div>
                <p
                  className="relative z-10 cursor-pointer font-light pb-3 text-white TeamB_text-shadow text-[1.3rem]"
                  onClick={showDescriptionHandle}>
                  Description
                </p>
              </div>
              <div
                className="flex justify-between w-[80%] m-auto px-2 py-1 mb-2 bg-red-500 rounded-md cursor-pointer text-red"
                onClick={deleteAllTopics}>
                <p className="text-white">Delete All Topics</p>
                <button className="text-[1.5rem]">
                  <MdDelete />
                </button>
              </div>
              <div className="h-[40vh] overflow-auto TeamB_no-scrollbar pr-3">
                {chapters.map((chap, idx) => {
                  const { topic } = chap;
                  console.log(chap);
                  return (
                    <div key={idx}>
                      {topic.map((tops, idx) => {
                        const { topic_title, topic_id } = tops;
                        console.log(tops);
                        return (
                          <div key={idx}>
                            <div className="flex items-center justify-between">
                              <p
                                className=" line-clamp-1 cursor-pointer py-1 font-light text-white TeamB_text-shadow  text-[1.2rem]"
                                onClick={() => {
                                  showEditHandle();
                                  setEditTopicId(topic_id);
                                }}>
                                {topic_title}
                              </p>

                              <span
                                className="text-[1.5rem] text-white cursor-pointer"
                                onClick={() => {
                                  setDeleteModalVisible((prev) => !prev);
                                  setDeleteTopicTitle(topic_id);
                                }}>
                                <MdDelete />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <div
                className="flex items-center h-[30%] justify-center"
                onClick={showAddHandle}>
                <div className="text-white text-[2.5rem] pr-2 cursor-pointer">
                  <IoIosAddCircle />
                </div>
                <span className="font-medium text-white cursor-pointer text-[1rem] ">
                  Add New Topic
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Delete Modal Section */}

        {deleteModalVisible && (
          <div className="fixed inset-0 z-10 flex items-center justify-center">
            <div className="lg:w-full">
              {chapters.map((chap, idx) => {
                const { topic } = chap;
                return (
                  <div key={idx}>
                    {topic.map((topic, idx) => {
                      const { topic_id } = topic;
                      return (
                        <div key={idx}>
                          {deleteModalVisible &&
                            deleteTopicTitle === topic_id && (
                              <DeleteTopicModal
                                topicId={topic_id}
                                deleteTopic={deleteTopic}
                              />
                            )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="w-[100%]">
          <div className="">
            <div>
              {showCourseDescription && (
                <div className="">
                  {courses.map((course, idx) => {
                    const { course_id } = course;
                    return (
                      <div key={idx}>
                        <CourseDescription courseId={course_id} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="">
            {showAddTopic && (
              <div className="">
                {courses.map((course, idx) => {
                  const { course_title } = course;
                  {
                    /* console.log(course_title); */
                  }
                  return (
                    <div key={idx}>
                      <AddTopic
                        // chapterId={chapter_id}
                        courseTitle={course_title}
                        // chapterTitle={chapter_title}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="">
            {showEditTopic && (
              <div className="">
                {courses.map((course, idx) => {
                  const { chapter, course_title } = course;
                  console.log(course_title);
                  return (
                    <div key={idx}>
                      {chapter.map((chap, idx) => {
                        const { topic, chapter_title, chapter_id } = chap;
                        return (
                          <div key={idx}>
                            {topic.map((topic, idx) => {
                              const { topic_description, topic_id } = topic;
                              console.log(topic_description);
                              return (
                                <div key={idx}>
                                  {showEditTopic &&
                                    editTopicId === topic_id && (
                                      <EditTopic
                                        topicId={topic_id}
                                        courseTitle={course_title}
                                        chapterTitle={chapter_title}
                                      />
                                    )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TopicPage;
