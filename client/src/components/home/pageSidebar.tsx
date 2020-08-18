import React from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { v4 as v4uuid } from "uuid";
import { Tooltip, Input, Pagination } from "antd";
import { connect } from "react-redux";
import { projectsPageSize } from "../../static";

const { Search } = Input;

interface IDefaultProps {
  projects: Array<any>;
  selectedProject: any;
  currentPage: number;
  totalProjectCount: number;
  projectFilter: string;
  projectPages: number;
  loggedUser: any;
  isUserRestricted: boolean;
  handleModalContent: Function;
  handleSelectedProject: Function;
  handleFilterState: Function;
  handlePageState: Function;
  handleSearchProjects: Function;
}

const SideBar = (props: IDefaultProps) => {
  const {
    projects,
    loggedUser,
    currentPage,
    projectPages,
    projectFilter,
    handlePageState,
    totalProjectCount,
    handleFilterState,
    selectedProject,
    handleSelectedProject,
    handleModalContent,
    handleSearchProjects,
    isUserRestricted,
  } = props;

  return (
    <div className="sidebar">
      {
        !isUserRestricted ? (
          <>
            <h2>Projects</h2>
      
            <div className="head-nav">
              <Search
                placeholder='Search'
                value={projectFilter}
                allowClear
                onChange={(e) => {
                  handleFilterState("projectFilter", e.target.value);
                }}
                onSearch={() => handleSearchProjects()}
              />
              {projectPages && projectPages > 1 ? (
                <Pagination
                  simple
                  current={currentPage}
                  total={totalProjectCount}
                  pageSize={projectsPageSize}
                  onChange={(value) => handlePageState('projectPage', value)}
                />
              ) : (
                <div></div>
              )}
            </div>
      
            <div className="projects-list">
              {projects && projects.length ? (
                <>
                  {projects.map((project) => (
                    <div
                      key={v4uuid()}
                      className={
                        selectedProject.id === project.id
                          ? "project-item selected"
                          : "project-item"
                      }
                      onClick={() => handleSelectedProject(project)}
                    >
                      <div className="projectCode">{project.code}</div>
                      <div className="projectTitle">
                        {project.title}
                        <Tooltip placement="right" title={project.description}>
                          <InfoCircleOutlined />
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="no-projects-container">No projects</div>
              )}
              {
                (loggedUser.role !== 'Developer' && loggedUser.role !== 'Manager') ? (
                  <div
                    className="project-item add-project"
                    onClick={() =>
                      handleModalContent({
                        modalVisible: true,
                        modalTitle: "Create new project",
                        modalMode: "CreateProject",
                      })
                    }
                  >
                    +
                  </div>
                ) : (
                  <></>
                )
              }
            </div>
          </>
        ) : (
          <div></div>
        )
      }
    </div>
  );
};

const mapStateToProps = (store: any) => ({
  totalProjectCount: store.projects.totalCount,
  projectPages: store.projects.pages
})

export default connect(mapStateToProps)(SideBar);
