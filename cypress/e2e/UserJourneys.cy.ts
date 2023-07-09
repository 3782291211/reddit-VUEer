const devURL: string = 'http://localhost:5173';
const centerScroll: Partial<Cypress.ClickOptions> = { scrollBehavior: 'center' };

describe('PopularThreadsView', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit('/');
  });

  it('visiting "/" redirects user to "/popular"', () => {
    cy.url().should('eq', `${devURL}/popular`);
  });

  it('visiting "/" renders list containing 25 popular threads', () => {
    cy.get('h1').first().should('have.text', 'Popular threads');
    cy.get('li.thread-preview').should('have.length', 25);
  });

  it('visiting "/" should render a single pagination button - next', () => {
    cy.get('[data-cy="popular-previous"]').should('not.exist');
    cy.get('[data-cy="popular-next"]').should('exist');
  });

  it('after clicking the next button, the previous button and a new list are rendered', () => {
    cy.get('[data-cy="threads-list"]').then(initialList => {
      cy.get('[data-cy="popular-next"]').first().click({ scrollBehavior: 'center' });
      cy.get('[data-cy="popular-previous"]').should('exist');
      cy.get('[data-cy="threads-list"]').should(listAfterPagination => {
        expect(listAfterPagination.children()).to.have.lengthOf(25)
        .and.to.not.deep.equal(initialList.children());
      });
    });
  });
});

describe('Navigation', () => {
  beforeEach(() => {
  // run these tests as if in a desktop browser with a 720p monitor
    cy.viewport(1280, 720);
    cy.visit('/');
  });

  it('Root layout links correctly update the URL', () => {
    cy.get('[data-cy="new-link"]').click(centerScroll).url().should('eq', `${devURL}/new`)
    cy.get('[data-cy="popular-link"]').click(centerScroll).url().should('eq', `${devURL}/popular`)
    cy.get('[data-cy="top-link"]').click(centerScroll).url().should('eq', `${devURL}/top`)
    cy.get('[data-cy="hot-link"]').click(centerScroll).url().should('eq', `${devURL}/hot`)
    cy.get('[data-cy="rising-link"]').click(centerScroll).url().should('eq', `${devURL}/rising`)
    cy.get('[data-cy="best-link"]').click(centerScroll).url().should('eq', `${devURL}/best`)
  });

  it('a user can navigate directly to a subreddit page using the correct URL', () => {
    cy.get('[data-cy="popular-subreddits"]').children().first().then(subredditListItem => {
      cy.visit('/' + subredditListItem[0].innerText);
      cy.get('h1').contains(subredditListItem[0].innerText);
      cy.get('.subreddit-threads-title').contains('Popular threads in ' + subredditListItem[0].innerText)
    });
  });

  it('clicking on a username hyperlink should take the user to the /search page', () => {
    cy.visit('/r/facepalm');
    cy.get('.user-link').first().then(userLink => {
      cy.visit(`/search?username=${userLink[0].innerText}`)
      cy.get('h3').contains(userLink[0].innerText);
      cy.get('[data-cy="search-comment-author"]').contains(userLink[0].innerText);
      // navigate away from the serach page to the single thread page
      cy.get('[data-cy="search-thread-link"]')
        .first()
        .invoke('text')
        .then(text => {
          // assert that the thread title matches the title on the comment card in the search page
          cy.get('[data-cy="search-thread-link"]').first().click(centerScroll);
          cy.get('h1').contains(text);
        });
    });
  });
});

describe('root layout', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit('/');
  });

  it('sidebar renders list of subreddits and enables user to search for a specific subreddit', () => {
    cy.get('[data-cy="popular-subreddits"]').children().should('have.length', 25);
    cy.get('[data-cy="sidebar-search"]').type('food');
    cy.get('[data-cy="sidebar-submit"]').click();
    cy.get('[data-cy="sidebar-search-results"]').contains('r/food');
    
    cy.get('[data-cy="sidebar-search"]').clear().type('megadeth');
    cy.get('[data-cy="sidebar-submit"]').click();
    cy.get('[data-cy="sidebar-search-results"]').contains(/r\/megadeth/i);
    // Clicking outside of the sidebar should hide the search results
    cy.get('[data-cy="threads-list"]').click(centerScroll);
    cy.get('[data-cy="sidebar-search-results"]').should('not.exist');
  });

  it('sidebar search returns "no results" if there are no matching subreddits', () => {
    cy.contains(/no results/i).should('not.exist');
    cy.get('[data-cy="sidebar-search"]').type('87hfe87gbsdfvusuvfsfews');
    cy.get('[data-cy="sidebar-submit"]').click();
    cy.contains(/no results/i).should('exist');
    cy.get('[data-cy="sidebar-search-results"]').should('not.exist');
    // "no results" message should disappear after 5 seconds
    cy.wait(4000);
    cy.contains(/no results/i).should('not.exist');
  });

  it('attempting to navigate to a private subreddit causes the error modal to appear', () => {
    cy.get('[data-cy="sidebar-search"]').type('photos');
    cy.get('[data-cy="sidebar-submit"]').click();
    cy.contains('r/photos').click(centerScroll);
    cy.get('[data-cy="error-modal"]').should('exist');
    cy.get('[data-cy="error-modal-msg"]')
      .contains('r/photos is a private community. Only approved members can view and take part in its discussions.');
    cy.get('[data-cy="error-modal-dismiss"]').click();
    cy.get('[data-cy="error-modal"]').should('not.exist');
  });

  it('top search bar allows user to search for a specific thread', () => {
    cy.get('[data-cy="navbar-input"]').type('Brownies with Swiss chocolate');
    cy.get('[data-cy="navbar-submit"]').click(centerScroll);
    cy.contains('Brownies with Swiss chocolate').click(centerScroll);
    cy.url().should('contain', '/r/food/comments/14rve4d/homemade_brownies_with_swiss_chocolate/');
    cy.get('h1').should('have.text', '[homemade] Brownies with Swiss chocolate');
  });

  it('searching for a non-existent article casues a notification to appear', () => {
    cy.get('[data-cy="navbar-input"]').type('sdfs9df8hsdf7gsd8fdsfsd');
    cy.get('[data-cy="navbar-submit"]').click(centerScroll);
    cy.contains('No results');
    cy.wait(3000);
    cy.get('.alert').should('not.exist');
  });
});

describe('mobile navbar', () => {
  beforeEach(() => {
    cy.viewport(412, 732);
    cy.visit('/');
  });

  it('Allows user to search for a specific thread', () => {
    cy.wait(2000);
    cy.get('[data-cy="mobile-menu-open"]').click(centerScroll);
    cy.contains('r/Home');
    cy.get('[data-cy="navbar-input"]').type('[homemade] ravioli');
    cy.get('[data-cy="navbar-submit"]').click();
    cy.contains(/\[homemade\] ravioli/i).click();
    cy.url().should('contain', '/r/food/comments/14ulzfv/homemade_ravioli/');
    cy.contains('h1', /\[homemade\] ravioli/i);
  });

  it('Allows user to serach for a specific subreddit', () => {
    cy.wait(2000);
    cy.get('[data-cy="mobile-menu-open"]').click(centerScroll);
    cy.get('#search').type('gaming');
    cy.get('[data-cy="sidebar-submit"]').click();
    cy.contains('r/gaming').click();
    cy.url().should('contain', 'r/gaming');
  });

  it('Mobile navbar \'users\' button takes closes the navbar menu and takes user to the correct page', () => {
    cy.wait(2000);
    cy.get('[data-cy="mobile-menu-open"]').click(centerScroll);
    cy.contains('Users').click();
    cy.get('#feeds').should('not.exist');
    cy.url().should('contain', '/search');
  });
});

describe('search user', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('searching for a user returns the user\'s profile data', () => {
    cy.visit('/search');
    cy.get('[data-cy="search-user-input"]').type('anotherfrankhere');
    cy.get('[data-cy="search-user-submit"]').click();
    cy.get('h3').contains(/u\/anotherfrankhere/i);
    cy.contains('Joined');
    cy.contains('Karma');
    cy.contains('h2', 'Posts');
    cy.get('[data-cy="popular=previous"]').should('not.exist');
    cy.get('[data-cy="popular-next"]').should('exist').click(centerScroll);
    cy.get('.thread-preview').first().contains(/(posted|replied)/i);
  });

  it('searching for a user returns a list of posts that can be paginated', () => {
    cy.visit('/search');
    cy.get('[data-cy="search-user-input"]').type('anotherfrankhere');
    cy.get('[data-cy="search-user-submit"]').click();
    cy.get('[data-cy="user-posts"]')
    .then(postsList => {
      expect(postsList[0].children).to.have.length(25);
    })
    .then(initialRender => {
      cy.get('[data-cy="popular-next"]').click(centerScroll);
      cy.get('[data-cy="popular-previous"]').click(centerScroll);
      cy.get('[data-cy="user-posts"]').then(nextRender => {
        const initialPosts = Array.from(initialRender.children()).map(post => post.innerHTML);
        const initialPostsAfterRerender = Array.from(nextRender.children()).map(post => post.innerHTML);
        // clicking 'next' followed by 'previous' returns the same inital list
        expect(initialPosts).to.deep.equal(initialPostsAfterRerender);
      })
    });
  });

  it('clicking on an article link within a comment card takes user to the article', () => {
    cy.visit('/search');
    cy.get('[data-cy="search-user-input"]').type('anotherfrankhere');
    cy.get('[data-cy="search-user-submit"]').click();
    cy.get('.title').first().then(title => {
      const newURL = title[0].getAttribute('href');
      cy.get('.title').first().click(centerScroll);
      cy.url().should('contain', newURL);
      cy.get('h1').contains(title.text());
    });
  });

  it('searching for a non-existent user renders error message', () => {
    cy.visit('/');
    cy.get('[data-cy="users-navlink"]').click(centerScroll);
    cy.get('[data-cy="error-modal"]').should('not.exist');
    cy.get('[data-cy="search-user-input"]').type('as98asdhfdasuyvfbdsyuvfdsgs');
    cy.get('[data-cy="search-user-submit"]').click();
    cy.get('[data-cy="error-modal"]').should('exist');
    cy.get('[data-cy="error-modal-msg"]').contains('I cannot find an account that matches that username');
    cy.get('[data-cy="error-modal-dismiss"]').click();
    cy.get('[data-cy="error-modal"]').should('not.exist');
  });

  it('searching for a user with no comments displays the appropriate feeddback message', () => {
    cy.visit('search?username=lukk');
    cy.contains('hmmm...u/lukk hasn\'t posted anything.');
  })
});