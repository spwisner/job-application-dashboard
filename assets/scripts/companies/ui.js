'use strict';

const store = require('../store');
const displayEditCompany = require('../templates/company/update-company-form.handlebars');
const displayCompanyDashboard = require('../templates/company/get-companies.handlebars');
const displayCompanyDetails = require('../templates/company/show-company-record.handlebars');
const displayCompanyCreateForm = require('../templates/company/create-company.handlebars');
const displayJobsTable = require('../templates/job/get-jobs.handlebars');
const displayRemindersTable = require('../templates/reminder/get-reminders.handlebars');
const displayShowJobTable = require('../templates/job/show-job.handlebars');
const displayShowReminderTable = require('../templates/reminder/show-group-table.handlebars');
// // const displayDashboard = require('../templates/dashboard/dashboard-btn.handlebars');
const companiesApi = require('./api');
const jobsApi = require('../jobs/api');
const remindersApi = require('../reminders/api');
// const jobsUi = require('../jobs/ui');

// Company UI

const getReminderSuccess = (data) => {
  $(".notification-container").children().text("");



  //
  // const numberOfReminders = data.statuses.length;
  // let singleReminderData = data.statuses[0];
  //
  // let singleReminderDetails = displayShowReminderTable({
  //   status: singleReminderData
  // });
  //
  // let reminderDashboard = displayRemindersTable({
  //   statuses: data.statuses
  // });
  //
  // if (numberOfReminders === 1 && store.oneJobListed) {
  //   $(".content").append(singleReminderDetails);
  // } else if (numberOfReminders > 1) {
  //   $(".content").append(reminderDashboard);
  // }
  //
  // $("#job-record-btn-edit").attr("data-current-company-id", store.currentCompanyId);
  // $("#job-record-delete").attr("data-current-company-id", store.currentCompanyId);
  // $("#create-job-company-btn").attr("data-current-company-id", store.currentCompanyId);
  // $("#job-reminder-create").attr("data-current-company-id", store.currentCompanyId);
};

// const getReminderFailure = () => {
//   $(".notification-container").children().text("");
// };

store.remindersObjectSave = {
  statuses: [],
};

const addOrRemove = function(signal, arr) {
  if (signal === "reset") {
    store.remindersObjectSave = {
      statuses: [],
    };
  } else {
    let tempStore = store.remindersObjectSave;
    tempStore.statuses.push(arr);
    store.remindersObjectSave = tempStore;
    return store.remindersObjectSave;
  }
};

store.testVal = false;

const remindersIterationSuccess = (data) => {
  // if (data.statuses.length > 0) {
  //   store.testVal = true;
  // }
};

const remindersIterationFailure = (data) => {
  console.log(data);
};

const remindersIteration = function(jobIdArr) {

  let remindersIterationContainer = $('<div class="reminders-group-table-container"><h1>Status Dashboard</h1></div>');

  let startingTemplate = $('<table class="table status-summary-table table-hover"><thead><tr><th>Status Type</th><th>Status Subject</th><th>Notification Date</th><th>View Record</th></tr></thead></table>');
  let tbody = $('<tbody class="reminder-summary-table-tbody"></tbody>');
  let homebuttons = $('<div class="dashboard-container"><button id="dashboard-home-btn" type="button" class="btn btn-primary dashboard-home-btn-status-page">View Dashboard</button><button id="dashboard-new-job-btn-status" type="button" class="btn btn-success dashboard-home-btn-status-page" data-current-reminder-id="{{status.id}}" data-type-status-page="{{status.status_page}}">Create Job</button></div>');

  for (let i = 0; i < jobIdArr.length; i++) {
    remindersApi.getRemindersIteration(jobIdArr[i])
      .then((response) => {
        if( response.statuses.length > 0 ) {
          let reminderDashboard = displayShowReminderTable({
            statuses: response.statuses
          });
          $(tbody).append(reminderDashboard);
        }
      })
      .done(remindersIterationSuccess)
      .fail(remindersIterationFailure);
  }
    $(startingTemplate).append(tbody);
    $(remindersIterationContainer).append(startingTemplate);
    $('.content').append(remindersIterationContainer);
    $('.content').append(homebuttons);
};

const getJobSuccess = (data) => {
  console.log('jobdata');
  console.log(data);

  const jobsObject = data.jobs;
  let jobsIdArr = [];
  let jobsTitleArr = [];

  for (let i = 0; i < jobsObject.length; i++) {
    jobsIdArr.push(jobsObject[i].id);
    jobsTitleArr.push(jobsObject[i].title);
  }

  $(".notification-container").children().text("");
  const numberOfJobs = data.jobs.length;
  let singleJobData = data.jobs[0];

  let singleJobDetails = displayShowJobTable({
    job: singleJobData
  });

  let jobDashboard = displayJobsTable({
    jobs: data.jobs
  });

  store.oneJobListed = (numberOfJobs === 1);

  if (numberOfJobs === 1) {
    $(".content").append(singleJobDetails);
  } else if (numberOfJobs > 1) {
    $(".content").append(jobDashboard);
  }
  // $('.company-dashboard-container').append(companyDashboard);
  const currentCompanyName = store.companyName;
  $("#job-record-btn-edit").attr("data-current-company-id", store.currentCompanyId);
  $("#job-record-delete").attr("data-current-company-id", store.currentCompanyId);
  $("#create-job-company-btn").attr("data-current-company-id", store.currentCompanyId);
  $("#job-reminder-create").attr("data-current-company-id", store.currentCompanyId);
  $(".current-company-name").text(currentCompanyName);

  remindersIteration(jobsIdArr, jobsTitleArr);
  // remindersApi.getReminders()
  //   .done(getReminderSuccess)
  //   .fail(getReminderFailure);
};

const getJobFailure = () => {
  $(".notification-container").children().text("");
};


const getCompanySuccess = (data) => {
  $(".notification-container").children().text("");
  store.companyPage = false;
  store.companyDataForEdit = data;

  $(".content").children().remove();
  let companyDashboard = displayCompanyDashboard({
    companies: data.companies
  });
  // $('.company-dashboard-container').append(companyDashboard);
  $('.content').append(companyDashboard);
  // $('.content').append(dashboardHomeBtn);
};

const showCompanyRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowCompanyData = data;
  store.companyName = data.company.name;
  data.company.company_page = true;
  store.companyPage = data.company.company_page;
  let companyDetails = displayCompanyDetails({
    company: data.company
  });
  // $('.company-details-container').append(companyDetails);
  $('.content').append(companyDetails);
  // store.currentCompanyFn = $(".company-name-header").attr("data-current-company-fn");
  // store.currentCompanyLn = $(".company-name-header").attr("data-current-company-ln");
  jobsApi.getJobs()
    .done(getJobSuccess)
    .fail(getJobFailure);
};
//
const showCompanyRecordFailure = () => {
  $(".notification-container").children().text("");
  console.log('failure');
};
//
const showCompanyCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateForm = displayCompanyCreateForm();
  $('.content').append(showCreateForm);
};

//
const updateFormGenerator = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let editCompany = displayEditCompany({
    company: store.lastShowCompanyData.company
  });
  $('.content').append(editCompany);
};
//
// const editCompanyFailure = () => {
//   $(".notification-container").children().text("");
// };
//
const getCompanyFailure = () => {
  $(".notification-container").children().text("");
  console.log('get company failure');
};
//
// const showCompanySuccess = () => {
//   $(".notification-container").children().text("");
// };
//
// const showCompanyFailure = () => {
//   $(".notification-container").children().text("");
// };
//
const createCompanySuccess = () => {
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Company Has Been Successfully Created");
  store.companyPage = true;
  let showCompanyDetails = displayCompanyDetails({
    company: store.createCompanyData.company
  });
  $(".content").append(showCompanyDetails);
  // companiesApi.showCompany()
  //   .done(showCompanyRecordSuccess)
  //   .fail(showCompanyRecordFailure);
  // $("#create-job-stud-id").attr("value", store.currentCompanyId);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
  // let dashboardHomeBtn = displayDashboard();
  // $('.content').append(dashboardHomeBtn);
};
//
// const createCompanyFailure = () => {
//   $(".notification-container").children().text("");
//   $(".form-error").text("");
//   $("#create-company-error").text("Error: Company not created.  Please ensure all required fields have values");
// };
//
const deleteCompanySuccess = () => {
  $(".notification-container").children().text("");
  console.log('delete success');
  companiesApi.getCompanies()
    .done(getCompanySuccess)
    .fail(getCompanyFailure);
};

const deleteCompanyFailure = () => {
  $(".notification-container").children().text("");
  console.log('delete fail');
};
//
const updateCompanySuccess = (data) => {
  $(".notification-container").children().text("");
  $(".success-alert").text("Company Has Been Successfully Updated");
  store.currentCompanyId = data.company.id;
  $(".content").children().remove();
  companiesApi.showCompany()
    .done(showCompanyRecordSuccess)
    .fail(showCompanyRecordFailure);
};

const updateCompanyFailure = () => {
  $(".notification-container").children().text("");
  $("#update-company-error").text("Error: Company not updated.  Please ensure all required fields have values");
};

module.exports = {
  getCompanySuccess,
  showCompanyRecordSuccess,
  deleteCompanySuccess,
  deleteCompanyFailure,
  updateFormGenerator,
  showCompanyCreateForm,
  // createCompanySuccess,
  // createCompanyFailure,
  getCompanyFailure,
  // showCompanySuccess,
  // showCompanyFailure,
  updateCompanySuccess,
  updateCompanyFailure,
  showCompanyRecordFailure,
  createCompanySuccess,
  getReminderSuccess,
};
