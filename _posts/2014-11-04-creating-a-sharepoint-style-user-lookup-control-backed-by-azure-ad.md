---
layout: post
title: Creating a SharePoint-style user lookup control backed by Azure AD
date: 2014-11-04 15:39:23.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- Azure AD
- C#
- Windows Azure
meta:
  _edit_last: '1'
  _syntaxhighlighter_encoded: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


This post describes how to create a SharePoint-style user lookup control backed by Azure AD.


## Practical Microsoft Azure Active Directory Blog Series


This post is part of the [Practical Microsoft Azure Active Directory Blog Series](http://robdmoore.id.au/blog/2014/06/29/practical-microsoft-azure-active-directory-blog-series/ "Practical Microsoft Azure Active Directory Blog Series").


- [Authenticating an ASP.NET MVC 5 application with Microsoft Azure Active Directory](http://robdmoore.id.au/blog/2014/06/29/authenticating-an-asp-net-mvc-5-application-with-microsoft-azure-active-directory/)
- [Explaining the code behind authenticating MVC5 app with Azure AD](http://robdmoore.id.au/blog/2014/10/24/explaining-the-code-behind-authenticating-mvc5-app-with-azure-ad/)
- [Add role-based authorisation based on Azure AD group membership](http://robdmoore.id.au/blog/2014/10/24/add-role-based-authorisation-based-on-azure-ad-group-membership/)
- [Creating a SharePoint-style user lookup control backed by Azure AD](http://robdmoore.id.au/blog/2014/11/04/creating-a-sharepoint-style-user-lookup-control-backed-by-azure-ad/)


## SharePoint-style user lookup


If you have used SharePoint then you will likely be familiar with a user lookup control that allows you to type in someone's name, press ctrl+k (or click on the Check Names button) and it will find the people from Active Directory and complete them for you.



This screenshot shows an example of what I'm describing:



[![SharePoint user lookup control]({{ site.baseurl }}/assets/sharepoint_userlookup_control-1024x69.png)](http://media.robdmoore.id.au/uploads/2014/11/sharepoint_userlookup_control.png)



If you are using Azure AD for authentication of your application then the [Graph API](http://msdn.microsoft.com/en-us/library/azure/hh974476.aspx) that it provides allows you to create a similar control.



This post provides instructions for a way to get this kind of control working. It's based on a [commit to the example repository](https://github.com/robdmoore/AzureAdMvcExample/commit/1e8b673bdcbd4327d5de64d641d03411d06f26bd) and you can see it in action on the [example website](https://azureadmvcexample.azurewebsites.net/UserLookup) (note: the username and password to log in from the [example repository homepage](https://github.com/robdmoore/AzureAdMvcExample)).


## Querying the graph API


In a [previous post](http://robdmoore.id.au/blog/2014/10/24/add-role-based-authorisation-based-on-azure-ad-group-membership/ "Add role-based authorisation based on Azure AD group membership") I introduced the AzureADGraphConnection class to wrap up calls to the Azure AD Graph API. For the purposes of adding a user lookup there are two methods that are useful to add:



```csharp
        public IList<User> SearchUsers(string query)
        {
            var displayNameFilter = ExpressionHelper.CreateStartsWithExpression(typeof(User), GraphProperty.DisplayName, query);
            var surnameFilter = ExpressionHelper.CreateStartsWithExpression(typeof(User), GraphProperty.Surname, query);
            var usersByDisplayName = _graphConnection
                .List<User>(null, new FilterGenerator { QueryFilter = displayNameFilter })
                .Results;
            var usersBySurname = _graphConnection
                .List<User>(null, new FilterGenerator { QueryFilter = surnameFilter })
                .Results;
            return usersByDisplayName.Union(usersBySurname, new UserComparer()).ToArray();
        }
        public User GetUser(Guid id)
        {
            try
            {
                return _graphConnection.Get<User>(id.ToString());
            }
            catch (ObjectNotFoundException)
            {
                return null;
            }
        }
        class UserComparer : IEqualityComparer<User>
        {
            public bool Equals(User x, User y)
            {
                return x.ObjectId == y.ObjectId;
            }
            public int GetHashCode(User obj)
            {
                return obj.ObjectId.GetHashCode();
            }
        }
```


- The SearchUsers method searches the DisplayName and Surname properties to see if they start with the given search string
  - The search is case insensitive
  - The API didn't seem to support an OR expression so I had to issue 2 API calls and union them together using a comparison class to remove duplicates
  - It returns a list of User objects, which leaks the internal implementation detail, you could construct a Read Model class that only contains the properties you are interested if you like, but that's let as an exercise for the reader
- The GetUser method allows you to pass in the ObjectId of a specific user to get back the corresponding User object
  - This is useful for post-back when you have used the user lookup control to get the ObjectId of a user



For this to work you need to ensure your Azure AD application has the permissions to read data from the directory as discussed in the [last post](http://robdmoore.id.au/blog/2014/10/24/add-role-based-authorisation-based-on-azure-ad-group-membership/ "Add role-based authorisation based on Azure AD group membership").


## Creating the user control semantics


The way the SharePoint control works is to automatically select the user if there is only one that is returned from the given search term, it highlights the search as incorrect when nobody is found for the search term, it presents a drop down list if multiple people are returned and it removes the complete person if a "resolved" name is backspaced.



In order to try and model these semantics as closely and simply as I could I created a [jQuery plugin](https://github.com/robdmoore/AzureAdMvcExample/blob/master/AzureAdMvcExample/Scripts/userlookup.js) in the example repository called userlookup.



I wanted to make it useful by default so it contains a bunch of default options to get you up and running quickly, but also allows you to completely customise it's behaviour.



The configuration options include:


- Whether or not to show a lookup button on the right of the control and what the HTML for it should be (true by default with HTML for appending an icon in a Bootstrap 3 application)
- What keypress(es) should prompt the lookup to occur (by default ctrl+k)
- What classes should be given to the control in the event that a user is successfully found, no match could be found and it's currently querying the server for users (matchfound, nomatchfound and loading by default)
- Whether or not the id of the user should be populated into a hidden field on selection of a user and the name of the data property that contains the id of the field if so (true and data-user-lookup by default)
- The URL of the API to call to query users (the API must accept a GET request with a query string of ?q=searchTerm and return a JSON list of users) (/api/userlookup by default)
- The name of the property of the user's name and id properties in the JSON returned by the API (DisplayName and ObjectId by default)
- The options to pass to the Twitter Typeahead plugin, which is used for the drop-down selection of users (some sensible defaults by default)



One thing to note is that there is nothing specific in the plugin about Azure AD (apart from the default name and id property names, that can be overriden) so this plugin could be easily used for querying other user stores.



As mentioned above, the plugin uses [Twitter Typeahead](https://twitter.github.io/typeahead.js/) for auto-complete when multiple users are returned from the search.



In order to use the plugin you need to:


1. Include [Twitter Typeahead JavaScript](https://github.com/robdmoore/AzureAdMvcExample/blob/master/AzureAdMvcExample/Scripts/typeahead.jquery.js) in the page (note: requires you have jQuery referenced on the page)
2. Include [userlookup JavaScript](https://github.com/robdmoore/AzureAdMvcExample/blob/master/AzureAdMvcExample/Scripts/userlookup.js) in the page
3. Include any required styling for Twitter Typeahead (e.g. for [Bootstrap 3](https://github.com/robdmoore/AzureAdMvcExample/blob/master/AzureAdMvcExample/Content/typeaheadjs.css))
4. Include any required styling for userlookup (e.g. what I have in the [example](https://github.com/robdmoore/AzureAdMvcExample/blob/master/AzureAdMvcExample/Content/userlookup.css) [repository](https://github.com/robdmoore/AzureAdMvcExample/blob/master/AzureAdMvcExample/Content/loading.gif))
5. Create the HTML for the control on your page, e.g. [using Bootstrap 3](https://github.com/robdmoore/AzureAdMvcExample/blob/master/AzureAdMvcExample/Views/UserLookup/Index.cshtml):
    ```html
            <div class="form-group">
                <label class="col-md-4 control-label" for="UserName">User name</label>
                <div class="col-md-6">
                    <input type="hidden" name="UserId" id="UserId" value="@Model.UserId"/>
                    <div class="input-group">
                        <input id="UserName" name="UserName" type="text" placeholder="Enter user's name and hit ctrl+k" class="form-control" required autofocus value="@Model.UserName" data-user-lookup="UserId">
                    </div>
                </div>
            </div>
    ```
6. Invoke the userlookup plugin, [e.g.](https://github.com/robdmoore/AzureAdMvcExample/blob/master/AzureAdMvcExample/Views/UserLookup/Index.cshtml):
    ```html
    <script type="text/javascript">
        $("[data-user-lookup]").userlookup();
        // Or you might want to configure some options, e.g. in this case the API url from a Razor MVC view
        $("[data-user-lookup]").userlookup({apiUrl: "@Url.Action("Search", "UserLookup")"});
    </script>
    ```



This will mean that you can type a query into the UserName field, press ctrl+k or click the lookup button and then it will guide you through "resolving" the user and when found set their id into the UserId field.


## Creating the API


The API can be created using anything that can return JSON. The example project contains an [ASP.NET MVC action as an example](https://github.com/robdmoore/AzureAdMvcExample/blob/master/AzureAdMvcExample/Controllers/UserLookupController.cs):



```csharp
        public ActionResult Search(string q)
        {
            var users = _graphConnection.SearchUsers(q);
            return Json(users, JsonRequestBehavior.AllowGet);
        }
```


## Dealing with the input on the server-side


The example repository contains an [example of resolving the selected user and then re-displaying it in the same view](https://github.com/robdmoore/AzureAdMvcExample/blob/master/AzureAdMvcExample/Controllers/UserLookupController.cs), a slightly more realistic example is shown below:



```csharp
    public class UserLookupController : Controller
    {
        ...
        public ActionResult Index()
        {
            return View(new UserLookupViewModel());
        }
        [HttpPost]
        public ActionResult Index(UserLookupViewModel vm)
        {
            vm.User = ModelState.IsValid ? _graphConnection.GetUser(vm.UserId.Value) : null;
            if (!ModelState.IsValid || vm.User == null)
                return View(vm);
            // Do stuff
        }
    }
    public class UserLookupViewModel
    {
        private User _user;
        [Required]
        public Guid? UserId { get; set; }
        [Required]
        public string UserName { get; set; }
        [ReadOnly(true)]
        public User User
        {
            get
            {
                return _user;
            }
            set
            {
                _user = value;
                if (_user == null)
                {
                    UserId = null;
                    return;
                }
                UserId = Guid.Parse(_user.ObjectId);
                UserName = _user.DisplayName;
            }
        }
    }
```


## Summary


This blog post illustrated some example code to create a SharePoint-like user lookup control. Of course, you could also just put in Twitter Typeahead and connect that to the user lookup API as well - that would perform more API calls though since it's not triggered by an explicit user action to issue the lookup, but arguably it's more discoverable for users.



Feel free to use the userlookup jQuery plugin in your projects, it's released as part of the [MIT license](https://github.com/robdmoore/AzureAdMvcExample/blob/master/LICENSE.txt) on the example project.

