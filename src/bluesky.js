
async function fetchBlueskyPosts(handle, limit = 10) {
    try {
        const response = await fetch(
            `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${handle}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data.feed.map(item => {
            const post = item.post || item;

            // Detect if this is a reply
            const isReply = post.record?.reply !== undefined;

            // Construct the full post URL
            const did = post.author.did;
            const rkey = post.uri.split('/').pop();
            const postUrl = `https://bsky.app/profile/${post.author.handle}/post/${rkey}`;

            // If it's a reply, get parent post details
            let parentText = null;
            let parentHandle = null;
            if (isReply) {
                const parentUri = post.record.reply.parent.uri;
                parentHandle = parentUri.split('/')[4];

                // Try to get parent post text from the feed item
                const parentPost = data.feed.find(
                    feedItem => feedItem.post.uri === post.record.reply.parent.uri
                );

                parentText = parentPost
                    ? (parentPost.post.record?.text || 'Original post not available')
                    : 'Original post not available';
            }


            return {
                text: post.record?.text || 'No text available',
                createdAt: post.record?.createdAt || new Date().toISOString(),
                images: post.embed?.images?.map(img => img.fullsize) || [],
                likes: post.likeCount || 0,
                reposts: post.repostCount || 0,
                isReply: isReply,
                parentHandle: parentHandle,
                parentText: parentText,
                author: {
                    handle: post.author.handle,
                    displayName: post.author.displayName || post.author.handle,
                    avatar: post.author.avatar || 'https://bsky.social/placeholder-avatar.png'
                },
                postUrl: postUrl
            };
        }).filter(post => post.text).slice(0, limit); // limit the number of posts
    } catch (error) {
        console.error('Error fetching Bluesky posts:', error);
        return [];
    }
}
function renderBlueskyPosts(containerId, posts) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return;
    }

    // Clear any existing content
    container.innerHTML = '<h2 id="bluesky-posts-header"><a href="https://bsky.app/profile/devdottalk.uk">{dev.talk} @ Bluesky</a></h2>';

    // Handle empty posts scenario
    if (posts.length === 0) {
        container.classList.add('error');
        container.innerHTML = '<p>No posts found.</p>';
        return;
    }

    // Remove any previous error class
    container.classList.remove('error');

    // Create posts
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = `bluesky-post ${post.isReply ? 'is-reply' : ''}`;

        postElement.innerHTML = `
        <a href="${post.postUrl}" target="_blank" class="post-link">
          <div class="post-header">
            <img src="${post.author.avatar}" alt="${post.author.handle} avatar" class="post-avatar">
            <div class="post-author">
              <span class="post-display-name">${escapeHtml(post.author.displayName)}</span>
              <span class="post-handle">@${post.author.handle}</span>
            </div>
          </div>
          
          ${post.isReply ? `
            <div class="reply-indicator">
              ↩ Reply to @${post.parentHandle}
            </div>
          ` : ''}
          
          <p>${escapeHtml(post.text)}</p>
          
          <small>Posted: ${new Date(post.createdAt).toLocaleString()}</small>
          
          ${post.images.length > 0 ?
                `<img src="${post.images[0]}" alt="Post image" class="post-image">`
                : ''}
          
          <div class="post-stats">
            <span>Likes: ${post.likes}</span>
            <span>Reposts: ${post.reposts}</span>
          </div>
        </a>
      `;

        container.appendChild(postElement);
    });
}

// Rest of the previous implementation remains the same

// Utility function to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function loadBlueskyPosts(handle, containerId, limit = 10) {
    try {
        const posts = await fetchBlueskyPosts(handle, limit);
        renderBlueskyPosts(containerId, posts);
    } catch (error) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<p>Error loading posts: ${error.message}</p>`;
            container.classList.add('error');
        }
        console.error('Failed to load Bluesky posts:', error);
    }
}