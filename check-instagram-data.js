const https = require('https')

async function checkInstagramData(username) {
  console.log(`Checking real Instagram data for @${username}`)
  
  return new Promise((resolve) => {
    const url = `https://www.instagram.com/${username}/`
    
    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      }
    }, (response) => {
      let data = ''
      
      response.on('data', (chunk) => {
        data += chunk
      })
      
      response.on('end', () => {
        console.log(`Got ${data.length} characters of HTML`)
        
        // Look for various patterns that might contain follower data
        const patterns = [
          /"edge_followed_by":\{"count":(\d+)\}/g,
          /"followed_by":\{"count":(\d+)\}/g,
          /"edge_followed_by":\{"count":(\d+)\}/g,
          /"followers":\{"count":(\d+)\}/g,
          /"follower_count":(\d+)/g,
          /"edge_followed_by":\{"count":(\d+)\}/g
        ]
        
        let followers = 0
        let following = 0
        let posts = 0
        
        for (const pattern of patterns) {
          const match = pattern.exec(data)
          if (match) {
            followers = parseInt(match[1])
            console.log(`Found followers: ${followers}`)
            break
          }
        }
        
        // Look for following count
        const followingPatterns = [
          /"edge_follow":\{"count":(\d+)\}/g,
          /"follows":\{"count":(\d+)\}/g,
          /"following_count":(\d+)/g
        ]
        
        for (const pattern of followingPatterns) {
          const match = pattern.exec(data)
          if (match) {
            following = parseInt(match[1])
            console.log(`Found following: ${following}`)
            break
          }
        }
        
        // Look for posts count
        const postsPatterns = [
          /"edge_owner_to_timeline_media":\{"count":(\d+)\}/g,
          /"media":\{"count":(\d+)\}/g,
          /"post_count":(\d+)/g
        ]
        
        for (const pattern of postsPatterns) {
          const match = pattern.exec(data)
          if (match) {
            posts = parseInt(match[1])
            console.log(`Found posts: ${posts}`)
            break
          }
        }
        
        // If we didn't find the data in JSON, try to find it in the HTML
        if (followers === 0) {
          // Look for follower count in HTML text
          const followerTextMatch = data.match(/(\d+(?:,\d+)*(?:\.\d+)?[KkMm]?)\s*followers/i)
          if (followerTextMatch) {
            const followerText = followerTextMatch[1]
            console.log(`Found follower text: ${followerText}`)
            
            // Parse K, M suffixes
            if (followerText.includes('K') || followerText.includes('k')) {
              followers = Math.floor(parseFloat(followerText.replace(/[Kk]/g, '')) * 1000)
            } else if (followerText.includes('M') || followerText.includes('m')) {
              followers = Math.floor(parseFloat(followerText.replace(/[Mm]/g, '')) * 1000000)
            } else {
              followers = parseInt(followerText.replace(/,/g, ''))
            }
          }
        }
        
        resolve({
          username,
          followers,
          following,
          posts,
          found: followers > 0
        })
      })
    })
    
    request.on('error', (error) => {
      console.error(`Error fetching @${username}:`, error.message)
      resolve({
        username,
        followers: 0,
        following: 0,
        posts: 0,
        found: false
      })
    })
    
    request.setTimeout(15000, () => {
      request.destroy()
      resolve({
        username,
        followers: 0,
        following: 0,
        posts: 0,
        found: false
      })
    })
  })
}

async function checkBothAccounts() {
  console.log('🔍 Checking real Instagram data...')
  
  const accounts = ['liammarshall20', 'georgewilliamss']
  
  for (const username of accounts) {
    try {
      const data = await checkInstagramData(username)
      console.log(`\n@${username}:`)
      console.log(`  👥 Followers: ${data.followers.toLocaleString()}`)
      console.log(`  👤 Following: ${data.following.toLocaleString()}`)
      console.log(`  📸 Posts: ${data.posts.toLocaleString()}`)
      console.log(`  ✅ Data found: ${data.found}`)
    } catch (error) {
      console.error(`❌ Error checking @${username}:`, error.message)
    }
  }
}

checkBothAccounts()

