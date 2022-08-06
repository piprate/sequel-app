const oneLiner = 'Sequel is a social platform where everything is for fun and purely fictional.'

module.exports = {
  // Home page, basic <title> and <description>
  appName: 'Sequel',
  appDescription: 'An official web client for Sequel.',
  ogDescription: 'A social platform where everything is for fun and purely fictional',
  homeDescription: `
    <p>
      ` + oneLiner + `
    </p>
    <p>
       Expand your imagination and express your playful self through sharing creative content beyond the limits of reality.
    </p>`,
  slogan: 'Only Fiction',
  signUp: 'Sign Up',
  copy: 'Copy',
  betaNotice: `Sequel is in private beta mode. Please contact us to get a registration code.`,
  betaNoticeNoCode: `Sequel is in beta mode. Early adopters will acquire superpowers and receive enormous gratitude from the Sequel team.`,
  signUpLegalNotice: `
      By signing up you agree to our <a rel="noopener" target="_blank" href="https://sequel.space/home/code-of-conduct/">Code of Conduct</a>
      and <a rel="noopener" target="_blank" href="https://sequel.space/home/application-privacy-policy/">Privacy Policy</a>,
      and confirm that you are at least 18 years old.`,
  continueAsVisitorLink: 'continue as Visitor',
  logIn: 'Log in',
  changeInstance: 'Change Instance',
  visitorBreadcrumb: 'Visitor Mode',
  visitorTitle: 'Enter as Visitor',
  visitorNotice: `
      You are about to experience Sequel as an anonymous visitor. Please note that the app's functionality will be limited
      as some features are only available for active <i>sparks</i> (virtual identities of the Sequel universe).`,
  continueAsVisitor: 'Continue',
  visitorLegalNotice: `
      By pressing Continue you agree to our <a rel="noopener" target="_blank" href="https://sequel.space/home/code-of-conduct/">Code of Conduct</a>
      and <a rel="noopener" target="_blank" href="https://sequel.space/home/application-privacy-policy/">Privacy Policy</a>,
      and confirm that you are at least 18 years old.`,
  visitorWorldsNotice: `
      Sequel worlds are loosely defined themes that group sparks and bubbles together.
      Each world may have a set of rules defined by its guardians to keep it in order.
      `,
  visitorBubblesNotice: `
      A bubble is a virtual place to hang out. Some bubbles belong to a world. Bubbles can move between worlds freely.`,
  footer: `
    <p>
      This <a rel="noopener" target="_blank" href="https://github.com/piprate/sequel-app">open-source</a>
      application is an official BETA client for
      <a rel="noopener" target="_blank" href="https://sequel.space">Sequel</a>
      developed by
      <a rel="noopener" target="_blank" href="https://piprate.com">Piprate</a> 
      and distributed under the <a rel="noopener" target="_blank" href="https://github.com/piprate/sequel-app/blob/main/LICENSE">AGPL License</a>.
      Here are the <a rel="noopener" target="_blank" href="https://sequel.space/home/application-privacy-policy/">Privacy Policy</a>
      and <a rel="noopener" target="_blank" href="https://sequel.space/home/code-of-conduct/">Code of Conduct</a>.
    </p>
  `,
  // Manifest
  longAppName: 'Sequel App',
  newPost: 'New post',
  // Generic UI
  loading: 'Loading',
  okay: 'OK',
  cancel: 'Cancel',
  alert: 'Alert',
  close: 'Close',
  error: 'Error: {error}',
  errorShort: 'Error:',
  // Relative timestamps
  justNow: 'just now',
  // Navigation, page titles
  navItemLabel: `
    {label} {selected, select,
      true {(current page)}
      other {}
    } {name, select,
      notifications {{count, plural,
        =0 {}
        one {(1 notification)}
        other {({count} notifications)}
      }}
      community {{count, plural,
        =0 {}
        one {(1 subscribe request)}
        other {({count} subscribe requests)}
      }}
      other {}
    }
  `,
  blockedSparks: 'Blocked sparks',
  bookmarks: 'Bookmarks',
  subscriptionsTimeline: 'Timeline',
  exclusiveTimeline: 'Exclusive',
  manageSubscriptions: 'Manage',
  home: 'Home',
  switch: 'Switch',
  notifications: 'Notifications',
  mutedSparks: 'Muted sparks',
  pinnedPosts: 'Pinned posts',
  subRequests: 'Subscription requests',
  subRequestsLabel: `Subscription requests {hasSubRequests, select,
    true {({count})}
    other {}
  }`,
  list: 'List',
  search: 'Search',
  pageHeader: 'Page header',
  goBack: 'Go back',
  back: 'Back',
  profile: 'Profile',
  // home page
  sparks: 'Sparks',
  tellMeMores: 'TMMs',
  bubbleNotices: 'Bubble joiners/leavers',
  worldNotices: 'World joiners/leavers',
  homePageGreeting: 'Hi, {spark}!',
  feelingDifferent: 'Feeling different?',
  switchAction: 'Switch',
  profileButton: 'Profile',
  yourBubbles: 'Your bubbles',
  yourWorlds: 'Your worlds',
  noBubblesFound: 'No bubbles found',
  sparkChoiceQuestion: 'Who would you like to be today?',
  createFirstSpark: 'Create your first spark',
  firstSparkNotice: `A spark is your imaginary identity. As a spark of your imagination,
  it enables you to be anything you ever wanted to be. You need a spark to interact with most things in Sequel.`,
  newSparkNotice: `Your sparks are not connected. Other users cannot identify your other sparks unless you make it obvious.
    You are free to be your new self.`,
  firstBubbleNotice: `A bubble is a virtual place to hang out. The bubble is also a story, an on-demand microblog,
    a one-in-a-lifetime event. Create a personal bubble or share it with other sparks.
    <a href="/bubbles/explore" sapper:prefetch>Explore</a> other bubbles.`,
  newBubbleNotice: 'A bubble is a virtual place to hang out. Choose your permissions carefully.',
  firstWorldNotice: `Are you brave enough? Sequel worlds are loosely defined themes that group sparks and
    bubbles together. You may have worlds for Gotham City, an alien planet, slacklining or healthy food.
    Each world may have a set of rules defined by its guardians to keep it in order.
    <a href="/worlds/explore" sapper:prefetch>Explore</a> existing worlds.`,
  worldCreationNotice: `Sequel worlds are loosely defined themes that group sparks and
    bubbles together. You may have worlds for Gotham City, an alien planet, slacklining or healthy food.
    Each world may have a set of rules defined by its guardians to keep it in order.`,
  newWorldNotice: `Use worlds to group sparks and bubbles together as a one coherent universe.
    Sparks may choose a 'home world'. Bubbles can relocate into a world. You can't post content
    into worlds, use bubbles instead.`,

  inductionLevelOneNotice: `Welcome to Sequel! Congratulations on creating your first spark. Now you can
    explore Sequel <a href="/worlds" sapper:prefetch>worlds</a> and <a href="/bubbles" sapper:prefetch>bubbles</a>.
    Write your first post by either joining an existing bubble or creating your own one.`,

  createNewSpark: 'Create new spark',
  selectSpark: 'Select',
  currentSparkLabel: `{spark} {current, select,
    true {(current spark)}
    other {}
  }`,
  switchToNameOfSpark: 'Switch to {spark}',
  switchToSpark: 'Switch to spark',
  sparkSelected: 'You are {spark} now',
  sparkBubbles: 'Bubbles',
  joinedIn: 'Joined {date}',
  // spark edit page
  newSpark: 'New spark',
  editSpark: 'Edit spark',
  switchAndEditSpark: 'Switch and edit spark',
  createSparkButton: 'Create',
  editSparkButton: 'Update',
  enterSparkName: 'Enter spark name',
  sparkNameColon: 'Name:',
  enterSparkSummary: 'Enter summary',
  sparkSummaryColon: 'Summary:',
  avatarColon: 'Avatar:',
  addAvatarImage: 'Upload avatar image',
  headerColon: 'Header:',
  addHeaderImage: 'Upload header image',
  enterSparkHandle: 'Enter Fediverse handle (optional)',
  sparkHandleColon: 'Handle:',
  homeWorldColon: 'Home World:',
  homeWorldSelectionTitle: 'Choose home world',
  nftSelectionFolderTitle: 'Choose NFT source',
  nftSelectionTitle: 'Choose NFT',
  noNFTsFound: 'No NFTs found',
  nftSourceNotSupported: 'NFT source not supported yet',
  // community page
  community: 'Community',
  explore: 'Explore',
  mySequel: 'My Sequel',
  bookmarkedPosts: 'Bookmarked posts',
  pinnableTimelines: 'Pinnable timelines',
  timelines: 'Timelines',
  lists: 'Lists',
  instanceSettings: 'Instance settings',
  notificationMentions: 'Notification mentions',
  profileWithMedia: 'Profile with media',
  profileWithComments: 'Profile with comments',
  hashtag: 'Hashtag',
  // timelines
  world: 'World',
  bubble: 'Bubble',
  spark: 'Spark',
  // worlds page
  worlds: 'Worlds',
  worldProfile: 'World Profile',
  worldMembers: 'Members',
  worldBubbles: 'Bubbles',
  createdIn: 'Created in {date}',
  yourWorldsTitle: 'Your worlds',
  worldExploreTitle: 'Explore',
  exploreSequelWorlds: 'Explore Sequel worlds',
  worldMembersNotLoggedIn: 'You need to be logged in to see world members.',
  worldBubblesNotLoggedIn: 'You need to be logged in to see the world\'s bubbles.',
  // sparks page
  yourSparksTitle: 'Your sparks',
  sparkBookmarksTitle: 'Bookmarks',
  sparkExploreTitle: 'Explore',
  noSparkBookmarksYet: `You haven't bookmarked any sparks yet.<br/><br/>
    Use <strong>Bookmark spark</strong> option in the menu on spark's profile.
    Bookmarks are handy if you don't intend to subscribe to the spark.
    The spark's owner won't be notified.`,
  // bubbles page
  yourBubblesTitle: 'Your bubbles',
  bubbleBookmarksTitle: 'Bookmarks',
  bubbleExploreTitle: 'Explore',
  bubbleProfile: 'Bubble Profile',
  bubbleMembers: 'Members',
  bubbleMembersNotLoggedIn: 'You need to be logged in to see bubble members.',
  noBubbleBookmarksYet: `You haven't bookmarked any bubbles yet.<br/><br/>
    Use <strong>Bookmark bubble</strong> option in the menu on bubble's profile.
    Bookmarks are handy if you don't intend to join the bubble as a member.`,
  // bubble edit page
  newBubble: 'New bubble',
  editBubble: 'Edit bubble',
  switchAndEditBubble: 'Switch and edit bubble',
  createBubbleButton: 'Create',
  editBubbleButton: 'Update',
  enterBubbleName: 'Enter bubble name',
  bubbleNameColon: 'Name:',
  enterBubbleSummary: 'Enter summary',
  bubbleSummaryColon: 'Summary:',
  enterBubbleHandle: 'Enter Fediverse handle (optional)',
  bubbleHandleColon: 'Handle:',
  membershipModeLabel: 'Adjust membership mode (currently {label})',
  membershipModeTitle: 'Who can join',
  observerModeLabel: 'Adjust who can view the bubble timeline (currently {label})',
  observerModeTitle: 'Who can view',
  writerModeLabel: "Adjust who can post in the bubble's timeline (currently {label})",
  writerModeTitle: 'Who can post',
  federationModeLabel: 'Change federation mode (currently {label})',
  federationModeTitle: 'Send to Fediverse',
  worldSelectionTitle: 'Place the bubble into a world',
  bubbleWorldColon: 'World:',
  changeWorld: 'Change',
  selectWorld: 'Select',
  worldNotAssigned: 'Not assigned',
  useButtonsAbove: 'Use the buttons above to change privacy settings.',
  // bubble membership modes
  mmInviteOnly: 'Invite Only',
  mmOpen: 'Open',
  mmPublic: 'Public',
  mmInviteOnlyDesc: 'Invite-only bubble.',
  mmOpenDesc: 'Everyone can join.',
  mmPublicDesc: 'Public bubble.',
  // bubble observer modes
  omMembers: 'Members Only',
  omPublic: 'Everyone',
  omMembersDesc: 'Only members can view.',
  omPublicDesc: 'Everyone can view.',
  // bubble writer modes
  wmNone: 'Owners and moderators',
  wmMembers: 'All Members',
  wmPublic: 'Everyone',
  wmNoneDesc: 'Only you can post.',
  wmMembersDesc: 'Only members can post.',
  wmPublicDesc: 'Everyone can post.',
  // bubble federation modes
  fmDisabled: 'Disabled',
  fmEnabled: 'Enabled',
  // world edit page
  newWorld: 'New world',
  editWorld: 'Edit world',
  createWorldButton: 'Create',
  editWorldButton: 'Update',
  enterWorldName: 'Enter world name',
  worldNameColon: 'Name:',
  enterWorldSummary: 'Enter summary',
  worldSummaryColon: 'Summary:',
  // not logged in
  sparkNotLoggedIn: 'A spark timeline will appear here when logged in.',
  worldNotLoggedIn: 'A world timeline will appear here when logged in.',
  bubbleNotLoggedIn: 'A bubble timeline will appear here when logged in.',
  bookmarksNotLoggedIn: 'Your bookmarks will appear here when logged in.',
  subscriptionsNotLoggedIn: 'Your subscription timeline will appear here when logged in.',
  favoritesNotLoggedIn: 'Your favorites will appear here when logged in.',
  searchNotLoggedIn: 'You can search once logged in to an instance.',
  communityNotLoggedIn: 'Community options appear here when logged in.',
  worldsNotLoggedIn: 'Sequel worlds appear here when logged in.',
  sparksNotLoggedIn: 'Sequel sparks appear here when logged in.',
  bubblesNotLoggedIn: 'Sequel bubbles appear here when logged in.',
  marketplaceNotLoggedIn: 'Marketplace listings appear here when logged in.',
  listNotLoggedIn: 'A list will appear here when logged in.',
  notificationsNotLoggedIn: 'Your notifications will appear here when logged in.',
  notificationMentionsNotLoggedIn: 'Your notification mentions will appear here when logged in.',
  postNotLoggedIn: 'A post thread will appear here when logged in.',
  tagNotLoggedIn: 'A hashtag timeline will appear here when logged in.',
  listingNotLoggedIn: 'Marketplace listing will appear here when logged in.',
  digitalArtNotLoggedIn: 'Digital Art will appear here when logged in.',
  // Notification subpages
  filters: 'Filters',
  all: 'All',
  mentions: 'Mentions',
  // Subscription requests
  approve: 'Approve',
  reject: 'Reject',
  // Hotkeys
  hotkeys: 'Hotkeys',
  global: 'Global',
  timeline: 'Timeline',
  media: 'Media',
  globalHotkeys: `
    {leftRightChangesFocus, select,
      true {
        <li><kbd>→</kbd> to go to the next focusable element</li>
        <li><kbd>←</kbd> to go to the previous focusable element</li>
      }
      other {}
    }
    <li>
      <kbd>1</kbd> - <kbd>6</kbd>
      {leftRightChangesFocus, select,
        true {}
        other {or <kbd>←</kbd>/<kbd>→</kbd>}
      }
      to switch columns
    </li>
    <li><kbd>7</kbd> or <kbd>c</kbd> to compose a new post</li>
    <li><kbd>s</kbd> or <kbd>/</kbd> to search</li>
    <li><kbd>g</kbd> + <kbd>h</kbd> to go home</li>
    <li><kbd>g</kbd> + <kbd>n</kbd> to go to notifications</li>
    <li><kbd>g</kbd> + <kbd>w</kbd> to go to the worlds page</li>
    <li><kbd>g</kbd> + <kbd>c</kbd> to go to the community page</li>
    <li><kbd>h</kbd> or <kbd>?</kbd> to toggle the help dialog</li>
    <li><kbd>Backspace</kbd> to go back, close dialogs</li>
  `,
  timelineHotkeys: `
    <li><kbd>j</kbd> or <kbd>↓</kbd> to activate the next post</li>
    <li><kbd>k</kbd> or <kbd>↑</kbd> to activate the previous post</li>
    <li><kbd>.</kbd> to show more and scroll to top</li>
    <li><kbd>o</kbd> to open</li>
    <li><kbd>b</kbd> to bookmark</li>
    <li><kbd>t</kbd> to TMM</li>
    <li><kbd>r</kbd> to reply</li>
    <li><kbd>i</kbd> to open images, video, or audio</li>
    <li><kbd>y</kbd> to show or hide sensitive media</li>
    <li><kbd>m</kbd> to mention the author</li>
    <li><kbd>p</kbd> to open the author's profile</li>
    <li><kbd>l</kbd> to open the card's link in a new tab</li>
    <li><kbd>x</kbd> to show or hide text behind content warning</li>
    <li><kbd>z</kbd> to show or hide all content warnings in a thread</li>
  `,
  mediaHotkeys: `
    <li><kbd>←</kbd> / <kbd>→</kbd> to go to next or previous</li>
  `,
  // Community page, tabs
  tabLabel: `{label} {current, select,
    true {(Current)}
    other {}
  }`,
  pageTitle: `
    {hasNotifications, select,
      true {({count})}
      other {}
    }
    {showInstanceName, select,
      true {{instanceName}}
      other {Sequel}
    }
    ·
    {name}
  `,
  pinLabel: `{label} {pinnable, select,
    true {
      {pinned, select,
        true {(Pinned page)}
        other {(Unpinned page)}
      }
    }
    other {}
  }`,
  pinPage: 'Pin {label}',
  // Post composition
  overLimit: '{count} {count, plural, =1 {character} other {characters}} over limit',
  underLimit: '{count} {count, plural, =1 {character} other {characters}} remaining',
  composePost: 'Compose post',
  publishPost: 'Publish',
  contentWarning: 'Content warning',
  dropToUpload: 'Drop to upload',
  invalidFileType: 'Invalid file type',
  composeLabel: "What's on your mind?",
  autocompleteDescription: 'When autocomplete results are available, press up or down arrows and enter to select.',
  mediaUploads: 'Media uploads',
  edit: 'Edit',
  delete: 'Delete',
  description: 'Description',
  descriptionLabel: 'Describe for the visually impaired (image, video) or auditorily impaired (audio, video)',
  markAsSensitive: 'Mark media as sensitive',
  // Polls
  createPoll: 'Create poll',
  removePollChoice: 'Remove choice {index}',
  pollChoiceLabel: 'Choice {index}',
  multipleChoice: 'Multiple choice',
  pollDuration: 'Poll duration',
  fiveMinutes: '5 minutes',
  thirtyMinutes: '30 minutes',
  oneHour: '1 hour',
  sixHours: '6 hours',
  twelveHours: '12 hours',
  oneDay: '1 day',
  threeDays: '3 days',
  sevenDays: '7 days',
  never: 'Never',
  addEmoji: 'Insert emoji',
  addMedia: 'Add media (images, video, audio)',
  addNFTMedia: 'Add NFT media (images, video, audio)',
  postPrivacyLabel: 'Adjust privacy (currently {label})',
  addContentWarning: 'Add content warning',
  removeContentWarning: 'Remove content warning',
  altLabel: 'Describe for the visually impaired',
  extractText: 'Extract text from image',
  extractingText: 'Extracting text…',
  extractingTextCompletion: 'Extracting text ({percent}% complete)…',
  unableToExtractText: 'Unable to extract text.',
  // Spark options
  subSpark: 'Subscribe to {spark}',
  unsubSpark: 'Unsubscribe from {spark}',
  blockSpark: 'Block {spark}',
  unblockSpark: 'Unblock {spark}',
  muteSpark: 'Mute {spark}',
  unmuteSpark: 'Unmute {spark}',
  showDomain: 'Unhide {domain}',
  hideDomain: 'Hide {domain}',
  reportSpark: 'Report {spark}',
  archiveSpark: 'Archive {spark}',
  mentionSpark: 'Mention {spark}',
  copyLinkToSpark: 'Copy link to spark',
  copiedToClipboard: 'Copied to clipboard',
  addSparkBookmark: 'Bookmark {spark}',
  // World options
  joinWorld: 'Join {world}',
  leaveWorld: 'Leave {world}',
  blockWorld: 'Block {world}',
  archiveWorld: 'Archive {world}',
  unblockWorld: 'Unblock {world}',
  copyLinkToWorld: 'Copy link to world',
  // Bubble options
  joinBubble: 'Join {bubble}',
  leaveBubble: 'Leave {bubble}',
  blockBubble: 'Block {bubble}',
  unblockBubble: 'Unblock {bubble}',
  archiveBubble: 'Archive {bubble}',
  copyLinkToBubble: 'Copy link to bubble',
  addBubbleBookmark: 'Bookmark {bubble}',
  removeBookmark: 'Remove bookmark',
  // Listing options
  withdrawListing: 'Withdraw',
  editListing: 'Update listing',
  copyLinkToListing: 'Copy link to listing',
  // Media dialog
  navigateMedia: 'Navigate media items',
  showPreviousMedia: 'Show previous media',
  showNextMedia: 'Show next media',
  enterPinchZoom: 'Pinch-zoom mode',
  exitPinchZoom: 'Exit pinch-zoom mode',
  showMedia: `Show {index, select,
    1 {first}
    2 {second}
    3 {third}
    other {fourth}
  } media {current, select,
    true {(current)}
    other {}
  }`,
  previewFocalPoint: 'Preview (focal point)',
  enterFocalPoint: 'Enter the focal point (X, Y) for this media',
  deleteImageButtonLabel: 'Delete image',
  muteNotifications: 'Mute notifications as well',
  muteSparkConfirm: 'Mute {spark}?',
  mute: 'Mute',
  unmute: 'Unmute',
  zoomOut: 'Zoom out',
  zoomIn: 'Zoom in',
  // Reporting
  reportingLabel: 'You are reporting {spark} to the moderators of {instance}.',
  additionalComments: 'Additional comments',
  forwardDescription: 'Forward to the moderators of {instance} as well?',
  forwardLabel: 'Forward to {instance}',
  unableToLoadPosts: 'Unable to load recent posts: {error}',
  report: 'Report',
  noContent: '(No content)',
  noPosts: 'No posts to report',
  // Post options
  unpinFromProfile: 'Unpin from profile',
  pinToProfile: 'Pin to profile',
  muteConversation: 'Mute conversation',
  unmuteConversation: 'Unmute conversation',
  bookmarkPost: 'Bookmark post',
  unbookmarkPost: 'Unbookmark post',
  editPost: 'Edit post',
  reportPost: 'Report post',
  sharePost: 'Share post',
  copyLinkToPost: 'Copy link to post',
  // Spark profile
  profileForSpark: 'Profile for {spark}',
  statisticsAndMoreOptions: 'Stats and more options',
  posts: 'Posts',
  subscriptions: 'Subscriptions',
  subscribers: 'Subscribers',
  moreOptions: 'More options',
  subscribersLabel: 'Has {count} subscribers',
  subscriptionsLabel: 'Has {count} subscriptions',
  subscribeLabel: `Subscribe {requested, select,
    true {(subscription requested)}
    other {}
  }`,
  unsubscribeLabel: `Unsubscribe {requested, select,
    true {(subscription requested)}
    other {}
  }`,
  unblock: 'Unblock',
  nameAndProperties: 'Name and properties',
  clickToSeeAvatar: 'Click to see avatar',
  opensInNewWindow: '{label} (opens in new window)',
  me: 'Me',
  managed: 'Managed',
  blocked: 'Blocked',
  domainHidden: 'Domain hidden',
  muted: 'Muted',
  isSubscriber: 'Is a subscriber',
  avatarForSpark: 'Avatar for {spark}',
  bubblesFromSpark: 'Bubbles from {spark}',
  createNewBubble: 'Create new bubble',
  createNewWorld: 'Create new world',
  selectSparkBeforeCreatingWorld: 'You need to select an active spark before creating new worlds.',
  fields: 'Fields',
  profilePageForSpark: 'Profile page for {spark}',
  // World home page
  profileForWorld: 'Profile for {world}',
  members: 'Members',
  bubbles: 'Bubbles',
  membersLabel: 'Has {count} members',
  bubblesLabel: 'Has {count} bubbles',
  joinWorldLabel: `Join {requested, select,
    true {(membership requested)}
    other {}
  }`,
  leaveWorldLabel: `Leave {requested, select,
    true {(membership requested)}
    other {}
  }`,
  avatarForWorld: 'Avatar for {world}',
  homePageForWorld: 'Home page for {world}',
  bubblesInWorld: 'Bubbles in {world}',
  // Bubble home page
  profileForBubble: 'Profile for {bubble}',
  assets: 'Assets',
  bubbleMembersLabel: 'Has {count} members',
  joinBubbleLabel: `Join {requested, select,
    true {(membership requested)}
    other {}
  }`,
  leaveBubbleLabel: `Leave {requested, select,
    true {(membership requested)}
    other {}
  }`,
  avatarForBubble: 'Avatar for {bubble}',
  homePageForBubble: 'Home page for {bubble}',
  // About page
  about: 'About',
  aboutApp: 'About Sequel App',
  aboutAppDescription: `
  <p>
    This application is an official BETA client for
    <a rel="noopener" target="_blank" href="https://sequel.space">Sequel</a>
    developed by
    <a rel="noopener" target="_blank" href="https://piprate.com">Piprate</a>.
  </p>

  <p>
    Sequel is a social platform where everything is for fun and purely fictional.
  </p>

  <h2 id="contact-details">Contact details</h2>

  <p>
    <ul>
        <li>Mastodon: <a rel="noopener" target="_blank" href="https://mastodon.social/@sequel">@sequel@mastodon.social</a></li>
        <li>Discord: <a rel="noopener" target="_blank" href="https://discord.gg/YaR7BFuXNk">Sequel</a></li>
        <li>Twitter: <a rel="noopener" target="_blank" href="https://twitter.com/sequelspace">@sequelspace</a></li>
        <li>Email: <a rel="noopener" target="_blank" href="mailto:info@sequel.space">info@sequel.space</a></li>
        <li>Matrix: <a rel="noopener" target="_blank" href="https://matrix.to/#/#sequel:matrix.org">#sequel:matrix.org</a></li>
        <li>Gemini: <a rel="noopener" target="_blank" href="gemini://sequel.space">gemini://sequel.space</a></li>
    </ul>
  </p>

  <h2 id="legal">Terms & Conditions</h2>

  <p>
    <ul>
        <li><a rel="noopener" target="_blank" href="https://sequel.space/home/code-of-conduct/">Code of Conduct</a><br/></li>
        <li><a rel="noopener" target="_blank" href="https://sequel.space/home/application-privacy-policy/">Privacy Policy</a></li>
    </ul>
  </p>

  <h2>Credits</h2>

  <p>
    The App is inspired by <a rel="noopener" target="_blank" href="https://nolanlawson.com">Nolan Lawson</a>'s
    <a rel="noopener" target="_blank" href="https://pinafore.social">Pinafore</a>.
  </p>

  <p>
    Icons provided by <a rel="noopener" target="_blank" href="http://fontawesome.io/">Font Awesome</a>.
  </p>`,
  // Settings
  settings: 'Settings',
  general: 'General',
  generalSettings: 'General settings',
  showSensitive: 'Show sensitive media by default',
  showPlain: 'Show a plain gray color for sensitive media',
  allSensitive: 'Treat all media as sensitive',
  largeMedia: 'Show large inline images and videos',
  autoplayGifs: 'Autoplay animated GIFs',
  hideCards: 'Hide link preview cards',
  underlineLinks: 'Underline links in posts and profiles',
  accessibility: 'Accessibility',
  reduceMotion: 'Reduce motion in UI animations',
  disableTappable: 'Disable tappable area on entire post',
  removeEmoji: 'Remove emoji from user display names',
  shortAria: 'Use short article ARIA labels',
  theme: 'Theme',
  themeForInstance: 'Theme for {instance}',
  disableCustomScrollbars: 'Disable custom scrollbars',
  centerNav: 'Center the navigation header',
  preferences: 'Preferences',
  hotkeySettings: 'Hotkey settings',
  disableHotkeys: 'Disable all hotkeys',
  leftRightArrows: 'Left/right arrow keys change focus rather than columns/media',
  guide: 'Guide',
  reload: 'Reload',
  // Flow settings
  flow: 'Flow Blockchain',
  flowSettings: 'Flow settings',
  flowNotLoggedIn: 'Flow configuration will appear here when logged in.',
  flowDescription: `Sequel uses <a rel="noopener" target="_blank" href="https://www.onflow.org/">Flow blockchain</a> to send and receive payments, buy and sell NFTs.
    Sign up or log in with your Flow wallet.`,
  flowAddress: 'Address',
  flowNetwork: 'Network',
  flowBalance: 'Balance (Flow)',
  fusdBalance: 'Balance (FUSD)',
  royaltyReceivers: 'Royalty Receivers',
  flowMismatchWarning: 'WARNING: the Flow account you are using differs from the account recorded in Sequel. Please switch to the account mentioned above.',
  flowSwitchButton: 'Switch account',
  flowSignUpButton: 'Sign Up with Flow',
  flowLogInButton: 'Log in with Flow',
  flowDisconnectButton: 'Disconnect from Flow',
  flowSkipStep: 'Skip this step',
  flowFinish: 'Finish',
  flowSetupRoyaltyReceiver: 'Add Royalty Receivers',
  flowTransactionCompleted: 'Transaction completed',
  flowTransactionFailed: 'Transaction failed',
  // Wellness settings
  wellness: 'Wellness',
  wellnessSettings: 'Wellness settings',
  wellnessDescription: `Wellness settings are designed to reduce the addictive or anxiety-inducing aspects of social media.
    Choose any options that work well for you.`,
  enableAll: 'Enable all',
  metrics: 'Metrics',
  hideSubscriberCount: 'Hide subscriber counts (capped at 10)',
  hideTMMCount: 'Hide TMM counts',
  hideUnread: 'Hide unread notifications count (i.e. the red dot)',
  // The quality that makes something seem important or interesting because it seems to be happening now
  immediacy: 'Immediacy',
  showAbsoluteTimestamps: 'Show absolute timestamps (e.g. "March 3rd") instead of relative timestamps (e.g. "5 minutes ago")',
  ui: 'UI',
  grayscaleMode: 'Grayscale mode',
  wellnessFooter: `These settings are partly based on guidelines from the
    <a rel="noopener" target="_blank" href="https://humanetech.com">Center for Humane Technology</a>.`,
  // This is a link: "You can filter or disable notifications in the _instance settings_"
  filterNotificationsPre: 'You can filter or disable notifications in the',
  filterNotificationsText: 'instance settings',
  filterNotificationsPost: '',
  // Custom tooltips, like "Disable _infinite scroll_", where you can click _infinite scroll_
  // to see a description. It's hard to properly internationalize, so we just break up the strings.
  disableInfiniteScrollPre: 'Disable',
  disableInfiniteScrollText: 'infinite scroll',
  disableInfiniteScrollDescription: `When infinite scroll is disabled, new posts will not automatically appear at
             the bottom or top of the timeline. Instead, buttons will allow you to
             load more content on demand.`,
  disableInfiniteScrollPost: '',
  // Instance settings
  loggedInAs: 'Logged in as',
  homeTimelineFilters: 'Home timeline filters',
  notificationFilters: 'Notification filters',
  pushNotifications: 'Push notifications',
  // Add instance page
  storageError: `It seems Sequel App cannot store data locally. Is your browser in private mode
          or blocking cookies? Sequel App stores all data locally, and requires LocalStorage and
          IndexedDB to work correctly.`,
  javaScriptError: 'You must enable JavaScript to log in.',
  enterInstanceName: 'Enter instance name',
  instanceColon: 'Instance:',
  enterInstanceEmail: 'Enter email',
  emailColon: 'Email:',
  enterInstancePassword: 'Enter password',
  passwordColon: 'Password:',
  confirmInstancePassword: 'Confirm password',
  confirmPasswordColon: 'Confirm password:',
  enterRegistrationCode: 'Enter registration code',
  registrationCodeColon: 'Registration Code:',
  invalidEmail: 'Invalid email',
  passwordMismatch: 'Passwords don\'t match',
  recoveryPhraseWarning: 'Recovery Phrase',
  saveRecoveryPhrase: 'Write down these words in the right order and save them somewhere safe.',
  continue: 'Continue',
  connectWithFlow: 'Connect with Flow',
  instancesYouveLoggedInTo: "Instances you've logged in to:",
  addAnotherInstance: 'Add another instance',
  youreNotLoggedIn: "You're not logged in to any instances.",
  currentInstanceLabel: `{instance} {current, select,
    true {(current instance)}
    other {}
  }`,
  // Link text
  logInToAnInstancePre: '',
  logInToAnInstanceOr: 'or',
  signUpToAnInstanceText: 'Sign up',
  logInToAnInstanceText: 'log in',
  logInToAnInstancePost: 'to an instance to start using Sequel App.',
  // Another custom tooltip
  showRingPre: 'Always show',
  showRingText: 'focus ring',
  showRingDescription: `The focus ring is the outline showing the currently focused element. By default, it's only
    shown when using the keyboard (not mouse or touch), but you may choose to always show it.`,
  showRingPost: '',
  instances: 'Instances',
  addInstance: 'Add instance',
  homeTimelineFilterSettings: 'Home timeline filter settings',
  showComments: 'Show comments',
  switchOrLogOut: 'Switch to or log out of this instance',
  switchTo: 'Switch to this instance',
  switchToInstance: 'Switch to instance',
  switchToNameOfInstance: 'Switch to {instance}',
  logOut: 'Log out',
  logOutOfInstanceConfirm: 'Log out of {instance}?',
  turnOffAnonymousMode: 'Visitor mode turned off',
  notificationFilterSettings: 'Notification filter settings',
  // Push notifications
  browserDoesNotSupportPush: "Your browser doesn't support push notifications.",
  deniedPush: 'You have denied permission to show notifications.',
  pushNotificationsNote: 'Note that you can only have push notifications for one instance at a time.',
  pushSettings: 'Push notification settings',
  newSubscribers: 'New subscribers',
  pollResults: 'Poll results',
  needToReauthenticate: 'You need to reauthenticate in order to enable push notification. Log out of {instance}?',
  failedToUpdatePush: 'Failed to update push notification settings: {error}',
  // Themes
  chooseTheme: 'Choose a theme',
  darkBackground: 'Dark background',
  lightBackground: 'Light background',
  themeLabel: `{label} {default, select,
    true {(default)}
    other {}
  }`,
  animatedImage: 'Animated image: {description}',
  showImage: `Show {animated, select,
    true {animated}
    other {}
  } image: {description}`,
  playVideoOrAudio: `Play {audio, select,
    true {audio}
    other {video}
  }: {description}`,
  newSubscriber: '{spark}, you have a new subscriber, {name}',
  tmmCountsHidden: 'TMM counts hidden',
  tellMeMoredTimes: `TMM {count, plural,
    one {1 time}
    other {{count} times}
  }`,
  pinnedPost: 'Pinned post',
  tmmedYou: 'TMMed your post',
  commented: 'New comment on your post',
  offeredNFT: 'offered',
  offeredSuffix: 'NFT',
  joinedHeader: 'joined',
  leftHeader: 'left',
  bubbleSuffix: 'bubble',
  subscribedToYourPosts: 'subscribed to your posts',
  pollYouCreatedEnded: 'A poll you created has ended',
  pollYouVotedEnded: 'A poll you voted on has ended',
  tmmed: 'TMMed',
  showSensitiveMedia: 'Show sensitive media',
  hideSensitiveMedia: 'Hide sensitive media',
  clickToShowSensitive: 'Sensitive content. Click to show.',
  longPost: 'Long post',
  // Accessible post labels
  sparkTMMedYou: '{spark} TMMed your post',
  sparkOfferedNFT: '{spark} offered you an NFT',
  sparkFavoritedYou: '{spark} favorited your post',
  contentWarningContent: 'Content warning: {spoiler}',
  hasMedia: 'has media',
  hasPoll: 'has poll',
  shortPostLabel: '{privacy} post by {spark}',
  postedIn: 'posted in {bubble}',
  // Privacy types
  fediverse: 'Send to Fediverse',
  public: 'Public',
  private: 'Members',
  subscribersOnly: 'Subscribers-only',
  // Themes
  themeSequelLight: 'Sequel Light',
  themeRoyal: 'Royal',
  themeScarlet: 'Scarlet',
  themeSeafoam: 'Seafoam',
  themeHotpants: 'Hotpants',
  themeOaken: 'Oaken',
  themeMajesty: 'Majesty',
  themeGecko: 'Gecko',
  themeGrayscale: 'Grayscale',
  themeOzark: 'Ozark',
  themeCobalt: 'Cobalt',
  themeSorcery: 'Sorcery',
  themePunk: 'Punk',
  themeRiot: 'Riot',
  themeSequel: 'Sequel',
  themeHacker: 'Hacker',
  themeMastodon: 'Mastodon',
  themePitchBlack: 'Pitch Black',
  themeDarkGrayscale: 'Dark Grayscale',
  // Polls
  voteOnPoll: 'Vote on poll',
  pollChoices: 'Poll choices',
  vote: 'Vote',
  pollDetails: 'Poll details',
  refresh: 'Refresh',
  expires: 'Ends',
  expired: 'Ended',
  voteCount: `{count, plural,
    one {1 vote}
    other {{count} votes}
  }`,
  // Post interactions
  clickToShowThread: '{time} - click to show thread',
  showMore: 'Show more',
  showLess: 'Show less',
  closeReply: 'Close reply',
  tellMeMore: 'Tell Me More',
  unTellMeMore: 'Remove TMM',
  reply: 'Reply',
  replyToThread: 'Reply to thread',
  favorite: 'Favorite',
  unfavorite: 'Unfavorite',
  // timeline
  loadingMore: 'Loading more…',
  loadMore: 'Load more',
  showCountMore: 'Show {count} more',
  nothingToShow: 'Nothing to show.',
  // post thread page
  postThreadPage: 'Post thread page',
  post: 'Post',
  // toast messages
  blockedSpark: 'Blocked spark',
  unblockedSpark: 'Unblocked spark',
  unableToBlock: 'Unable to block spark: {error}',
  unableToUnblock: 'Unable to unblock spark: {error}',
  blockedWorld: 'Blocked world',
  unblockedWorld: 'Unblocked world',
  unableToBlockWorld: 'Unable to block world: {error}',
  unableToUnblockWorld: 'Unable to unblock world: {error}',
  blockedBubble: 'Blocked bubble',
  unblockedBubble: 'Unblocked bubble',
  unableToBlockBubble: 'Unable to block bubble: {error}',
  unableToUnblockBubble: 'Unable to unblock bubble: {error}',
  bookmarkedPost: 'Bookmarked post',
  unbookmarkedPost: 'Unbookmarked post',
  bookmarkedBubble: 'Bookmarked bubble',
  unbookmarkedBubble: 'Unbookmarked bubble',
  bookmarkedSpark: 'Bookmarked spark',
  unbookmarkedSpark: 'Unbookmarked spark',
  unableToBookmark: 'Unable to bookmark: {error}',
  unableToUnbookmark: 'Unable to unbookmark: {error}',
  cannotPostOffline: 'You cannot post while offline',
  unableToPost: 'Unable to post: {error}',
  postDeleted: 'Post deleted',
  unableToDelete: 'Unable to delete post: {error}',
  bubbleArchived: 'Bubble archived',
  unableToArchiveBubble: 'Unable to archive bubble: {error}',
  sparkArchived: 'Spark archived',
  unableToArchiveSpark: 'Unable to archive spark: {error}',
  worldArchived: 'World archived',
  unableToArchiveWorld: 'Unable to archive world: {error}',
  subbedSpark: 'Subscribed to spark',
  unsubbedSpark: 'Unsubscribed from spark',
  unableToSubscribe: 'Unable to subscribe to spark: {error}',
  unableToUnsubscribe: 'Unable to unsubscribe from spark: {error}',
  joinedWorld: 'Joined world',
  leftWorld: 'Left world',
  unableToJoinWorld: 'Unable to join world: {error}',
  unableToLeaveWorld: 'Unable to leave world: {error}',
  joinedBubble: 'Joined bubble',
  leftBubble: 'Left bubble',
  unableToJoinBubble: 'Unable to join bubble: {error}',
  unableToLeaveBubble: 'Unable to leave bubble: {error}',
  accessTokenRevoked: 'The access token was revoked, logged out of {instance}',
  loggedOutOfInstance: 'Logged out of {instance}',
  failedToUploadMedia: 'Failed to upload media: {error}',
  mutedSpark: 'Muted spark',
  unmutedSpark: 'Unmuted spark',
  unableToMute: 'Unable to mute spark: {error}',
  unableToUnmute: 'Unable to unmute spark: {error}',
  mutedConversation: 'Muted conversation',
  unmutedConversation: 'Unmuted conversation',
  unableToMuteConversation: 'Unable to mute conversation: {error}',
  unableToUnmuteConversation: 'Unable to unmute conversation: {error}',
  unpinnedPost: 'Unpinned post',
  unableToPinPost: 'Unable to pin post: {error}',
  unableToUnpinPost: 'Unable to unpin post: {error}',
  unableToRefreshPoll: 'Unable to refresh poll: {error}',
  unableToVoteInPoll: 'Unable to vote in poll: {error}',
  cannotTMMOffline: 'You cannot TMM while offline.',
  cannotUnTMMOffline: 'You cannot un-TMM while offline.',
  cannotBookmarkOffline: 'You cannot bookmark while offline.',
  cannotUnbookmarkOffline: 'You cannot un-bookmark while offline.',
  failedToTMM: 'Failed to TMM: {error}',
  failedToUnTMM: 'Failed to un-TMM: {error}',
  submittedReport: 'Submitted report',
  failedToReport: 'Failed to report: {error}',
  approvedSubscriptionRequest: 'Approved subscription request',
  rejectedSubscriptionRequest: 'Rejected subscription request',
  unableToApproveSubscriptionRequest: 'Unable to approve subscription request: {error}',
  unableToRejectSubscriptionRequest: 'Unable to reject subscription request: {error}',
  searchError: 'Error during search: {error}',
  hidDomain: 'Hid domain',
  unhidDomain: 'Unhid domain',
  unableToHideDomain: 'Unable to hide domain: {error}',
  unableToUnhideDomain: 'Unable to unhide domain: {error}',
  unableToShare: 'Unable to share: {error}',
  showingOfflineContent: 'Internet request failed. Showing offline content.',
  requestFailed: 'Request failed',
  youAreOffline: 'You seem to be offline. You can still read posts while offline.',
  // Snackbar UI
  updateAvailable: 'App update available.',
  // Word/phrase filters
  wordFilters: 'Word filters',
  noFilters: 'You don\'t have any word filters.',
  wordOrPhrase: 'Word or phrase',
  contexts: 'Contexts',
  addFilter: 'Add filter',
  editFilter: 'Edit filter',
  filterHome: 'Home and lists',
  filterNotifications: 'Notifications',
  filterPublic: 'Public timelines',
  filterThread: 'Conversations',
  filterSpark: 'Sparks',
  filterUnknown: 'Unknown',
  expireAfter: 'Expire after',
  whereToFilter: 'Where to filter',
  irreversible: 'Irreversible',
  wholeWord: 'Whole word',
  save: 'Save',
  updatedFilter: 'Updated filter',
  createdFilter: 'Created filter',
  failedToModifyFilter: 'Failed to modify filter: {error}',
  deletedFilter: 'Deleted filter',
  required: 'Required',
  // Dialogs
  profileOptions: 'Profile options',
  worldProfileOptions: 'World profile options',
  bubbleProfileOptions: 'Bubble profile options',
  marketplaceListingOptions: 'Listing options',
  copyLink: 'Copy link',
  emoji: 'Emoji',
  editMedia: 'Edit media',
  shortcutHelp: 'Shortcut help',
  postOptions: 'Post options',
  confirm: 'Confirm',
  closeDialog: 'Close dialog',
  postPrivacy: 'Post privacy',
  selectedWorldLabel: `{world} {selected, select,
    true {(selected world)}
    other {}
  }`,
  switchToNameOfWorld: 'Switch to {world}',
  selectWorldFromList: 'Select world',
  worldList: 'Worlds',
  selectedPlanLabel: `{plan} {selected, select,
    true {(selected plan)}
    other {}
  }`,
  switchToNameOfPlan: 'Switch to {plan}',
  selectPlanFromList: 'Select subscription plan',
  planList: 'Subscription plans',
  subscribeLater: `I'll subscribe later`,
  // Bubble member types
  memberTypeOwner: 'Owner',
  memberTypeModerator: 'Moderator',
  memberTypeMember: 'Member',
  memberTypeReader: 'Reader',
  readOnly: 'Read Only',
  inviteOnly: 'Invite Only',
  featureNotImplemented: 'Feature not implemented. Please come back later.',
  bubbleNotFound: 'Bubble not found',
  sparkNotFound: 'Spark not found',
  worldNotFound: 'World not found',
  listingNotFound: 'Listing not found',
  digitalArtNotFound: 'Digital Art not found',
  tokenNotFound: 'Token not found',
  accessRestricted: 'Access restricted. You need to be logged in to see this page.',
  invalidExternalRequest: `
    <h2>
        The page you asked for doesn't exist.
    </h2>
    <p>
      ` + oneLiner + `
    </p>
    <p>
        Please stay and explore.
    </p>`,
  loginToFollowLink: `
    <p>
      ` + oneLiner + `
    </p>
    <p>
       Please log in to see the requested Sequel resource.
    </p>`,
  chooseSubscriptionPlan: 'Choose plan',
  communityPlanName: 'Community Plan',
  standardPlanName: 'Standard Plan',
  unknownPlanName: 'Unknown Plan',
  communityPlanCost: 'Free',
  standardPlanCost: `{currency}{fee} {duration, select,
    perpetual {(never expires))}
    week {per week}
    month {per month}
    year {per year}
    other {}
  }`,
  // Subscriptions
  noSubscriptionsYet: `You haven't subscribed to any sparks yet.<br/><br/>
    Use <strong>Subscribe</strong> button on spark's profile to enable access
    to the spark's exclusive, subscriber-only content. Creators have access
    to the list of their subscribers.`,
  // Bubble invitations
  inviteToRead: 'Timeline visible to members only.',
  inviteToPost: 'You need to be a member to post.',
  joinBubbleButton: 'Join',
  avatarCroppingNotice: 'PNG, GIF or JPG. Please use square shaped images, 300x300px or larger. Rectangular images will be cropped.',
  // Marketplace
  marketplace: 'Marketplace',
  marketplaceTitle: 'Sequel Marketplace',
  marketplaceEmpty: 'Marketplace is empty. Please come back soon to buy and sell digital art produced from original Sequel content.',
  listing: 'Marketplace Listing',
  listingPage: 'Marketplace Listing for {listing}',
  editionsAvailable: '{available} out of {total}',
  free: 'Free',
  imageForToken: 'Image for {token}',
  payments: 'Payments',
  evergreenProfile: 'Evergreen Profile',
  price: 'Price',
  editions: 'Editions',
  sold: 'Sold',
  evergreenHeaderRole: 'Role',
  evergreenHeaderAddress: 'Address',
  evergreenHeaderPrimary: 'Mint',
  evergreenHeaderSecondary: 'Trade',
  confirmationNotice: 'You are seconds away from purchasing <strong>{token}</strong>.<br/><br/>' +
    'Please review order details before proceeding to your Flow wallet.',
  modSparkNotSelected: 'You need to select a spark to buy tokens',
  confirmButton: 'Confirm',
  buyTokenTitle: 'Buy Digital Art',
  buyButtonLabel: 'Buy',
  claimButtonLabel: 'Claim',
  logInBeforeBuying: 'You need to log in before buying digital art.',
  saleInProgress: 'Sale in Progress',
  saleError: 'Error',
  initModStatus: '(1/7) Initialising Mint On Demand...',
  openWalletStatus: '(2/7) Opening Flow wallet...',
  txSigningStatus: '(3/7) Signing transaction...',
  waitSealStatus: '(4/7) Submitting transaction...',
  txExecutedStatus: '(5/7) Transaction executed...',
  txSealedStatus: '(6/7) Transaction sealed...',
  confirmSaleStatus: '(7/7) Confirming sale...',
  congratulations: 'Congratulations!',
  purchaseSuccessful: 'Your purchase has been completed successfully.',
  // Assets pages
  assetsPageTitle: 'Assets',
  collectionEmpty: 'Your collection is empty. Visit <a href="/marketplace" sapper:prefetch>Marketplace</a> to buy digital art.',
  // Token page
  tokenPageTitle: 'Token',
  tokenID: 'ID',
  tokenEdition: 'Edition',
  tokenType: 'Type',
  tokenEditions: '#{edition} of {total}',
  // Studio
  studio: 'Studio',
  studioEmpty: 'Your studio is empty. Wait for general release.',
  digitalArt: 'Digital Art',
  digitalArtStatus: 'Status',
  digitalArtEditions: 'Editions',
}
