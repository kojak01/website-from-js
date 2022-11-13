'use strict';
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTags: Handlebars.compile(document.querySelector('#template-article-tags').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML),
}

const opts = {
  AuthorsListSelector: '.authors.list',
  CloudClassPrefix: 'tag-size-',
  CloudClassCount: '5',
  TagsListSelector: '.tags.list',
  ArticleAuthorSelector: '.post-author',
  ArticleTagsSelector: '.post-tags .list',
  TitleListSelector: '.titles',
  TitleSelector: '.post-title',
  ArticleSelector: '.post',
}
 
const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  /* [DONE] remove class 'active' from all article links */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */
    //console.log('clickedElement: ', clickedElement);
    clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* [DONE]  get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    //console.log(articleSelector);
  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector)
  /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
 }
 
 function generateTitleLinks(customSelector = ''){
  /* [DONE] remove contents of titleList */
  const titleList = document.querySelector(opts.TitleListSelector);
  titleList.innerHTML = '';
  /* [DONE] for each article */
  const articles = document.querySelectorAll(opts.ArticleSelector + customSelector);
  let html = '';
  for(let article of articles) {
    /* [DONE] get the article id */
  const articleId = article.getAttribute('id');
  /* [DONE] find the title element */
  const articleTitle = article.querySelector(opts.TitleSelector).innerHTML;  
  /* [DONE] create HTML of the link */
  // const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
  const linkHTMLData = {id: articleId, title: articleTitle};
  const linkHTML = templates.articleLink(linkHTMLData);
  /* insert link into titleList */
  html = html + linkHTML;
  //console.log(html);
  };
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
    for(let link of links){
  link.addEventListener('click', titleClickHandler);
 };
};
generateTitleLinks();

const calculateTagsParams = function(tags){
  const params = {
    max: '0',
    min: '999999'
  };
  for(let tag in tags){
    //console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max){
      params.max = tags[tag];
    } else if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
};
const calculateTagClass = function(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.CloudClassCount - 1) + 1 );
  return opts.CloudClassPrefix + classNumber;
};
function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(opts.ArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
  const tagsWrapper = article.querySelector(opts.ArticleTagsSelector);
  /* make html variable with empty string */
  let html = ''; //         <-- we will be adding more code snippets -->
  /* get tags from data-tags attribute */
  const articleTags = article.getAttribute('data-tags');
  /* split tags into array */
  const articleTagsArray = articleTags.split(' ');
  /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link */
      const linkHTMLData = {id: tag, tag: tag};
      const linkHTML = templates.articleTags(linkHTMLData);
      // const linkHTML = '<li><a href="#tag-' + tag +'">' + tag + '</a></li>';
      /* add generated code to html variable */
      html = html + linkHTML + ' ';
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]) {
      /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      };
    }; 
  /* END LOOP: for each tag */
  /* insert HTML of all the links into the tags wrapper */
  tagsWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  };
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.TagsListSelector);
  /* [NEW] add html from allTags to tagList
  tagList.innerHTML = allTags.join(' ');
  //console.log(allTags);*/
  /* [NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  //console.log('tagsParams:', tagsParams)
  // let allTagsHTML = '';
  const allTagsData = {tags: []};
  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    let allTagsHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '"> ' + tag + '</a></li>';
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  // tagList.innerHTML = allTagsHTML;
 };
 generateTags();

 function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let activeTag of activeTags){
    /* remove class active */
    activeTag.classList.remove('active');
    /* END LOOP: for each active tag link */
  };
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="#tag-' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let tagLink of tagLinks) {
    /* add class active */
    tagLink.classList.add('active');
    /* END LOOP: for each found tag link */
  };
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for (let tagLink of tagLinks){
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}
addClickListenersToTags();
 
function generateAuthors() {
  /* create a new variable allAuthors with an empty object */
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(opts.ArticleSelector);
  /* START LOOP: for every article*/
  for(let article of articles) {
    /* find author wrapper*/
    const authorsList =  article.querySelector(opts.ArticleAuthorSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');
    /* generate HTML of the link */
    const linkHTMLData = {id: articleAuthor, authors: articleAuthor};
    const linkHTML = templates.articleAuthor(linkHTMLData);
    //const linkHTML = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    /* add generated code to html variable */
    html = html + linkHTML;
    /* check if this link is NOT already in allTags */
    if(!allAuthors[articleAuthor]) {
      /* add tag to allTags object */
      allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }
     /* insert HTML of all the links into the Authors wrapper */
    authorsList.innerHTML = html;
  };
  /* find list of tags in right column */
  const authorList = document.querySelector(opts.AuthorsListSelector);
  /* create variable for all links HTML*/
  // let allAuthorsHTML = '';
  const allAuthorsData = {authors: []};
  /* START LOOP: for each tag in allTags: */
  for(let author in allAuthors){
    /*  generate code of a link and add it to allTagsHTML */
    // allAuthorsHTML += '<li><a href="#author-' + author + '"><span>' + author + ' (' + allAuthors[author] + ') ' + '</span></a></li>';
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
    });
    authorList.innerHTML = templates.authorListLink(allAuthorsData);
  }
  /*[NEW] add HTML from allTagsHTML to tagList */
  // authorList.innerHTML = allAuthorsHTML;

};

generateAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');
  /* find all tag links with class active */
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active tag link */
  for(let activeAuthor of activeAuthors) {
    /* remove class active */
    activeAuthor.classList.remove('active');
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const authorsHref = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let authorHref of authorsHref) {
    /* add class active */
    authorHref.classList.add('active');
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
};

function addClickListenersToAuthors(){
  /* find all links to authors */
  const LinksToAuthors = document.querySelectorAll('a[href^="#author-"]');
  for(let link of LinksToAuthors) {
  /* add authorClickHandler as eventListener for that link */
  link.addEventListener('click', authorClickHandler);
  }
};

addClickListenersToAuthors();