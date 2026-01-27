# Admin User Management Guide

## Overview
Your application now uses **Appwrite labels** to identify admin users. This is more flexible and secure than hardcoding emails.

## How to Make a User an Admin

### Method 1: Using Appwrite Console (Recommended)

1. **Open your Appwrite Console**
   - Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)
   - Navigate to your project: `6977a612001b04e10dd8`

2. **Navigate to Users**
   - Click on **Auth** in the sidebar
   - Click on **Users**

3. **Select the User**
   - Find the user you want to make an admin
   - Click on their email/name to open their details

4. **Add Admin Label**
   - Scroll to the **Labels** section
   - Click **Add Label**
   - Type: `admin` (lowercase, exactly as shown)
   - Click **Add** or press Enter

5. **Done!**
   - The user will now have admin access
   - They may need to log out and log back in for changes to take effect

### Method 2: Using Appwrite API (Advanced)

If you want to programmatically add admin labels, you can use the Appwrite Server SDK:

```typescript
// This requires Server SDK with API key - not recommended for client-side
import { Users } from 'node-appwrite';

const users = new Users(client);

// Add admin label to user
await users.updateLabels(
  'USER_ID_HERE',
  ['admin']  // Add 'admin' label
);
```

## How to Check if a User is Admin

The `useAuth` hook automatically checks for admin status:

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAdmin } = useAuth();
  
  if (isAdmin) {
    // User is an admin
  }
}
```

## How Admin Check Works

The admin check is performed in `useAuth.tsx`:

```typescript
// Check if user has 'admin' label
setIsAdmin(currentUser.labels?.includes('admin') || false);
```

- `currentUser.labels` is an array of strings
- We check if it includes the string `'admin'`
- If user has no labels, it defaults to `false`

## Removing Admin Access

1. Go to Appwrite Console → Auth → Users
2. Select the user
3. In the Labels section, click the **X** next to the "admin" label
4. User will lose admin access immediately

## Multiple Admin Levels (Future Enhancement)

If you need different admin levels in the future, you can use multiple labels:

```typescript
// Add different labels
Labels: ['admin', 'super-admin', 'moderator']

// Check in code
const isSuperAdmin = user?.labels?.includes('super-admin');
const isModerator = user?.labels?.includes('moderator');
```

## Security Notes

✅ **Secure**: Labels can only be modified through the Appwrite Console or Server API (with API key)
✅ **Client-Side Safe**: Users cannot modify their own labels from the client
✅ **Flexible**: Easy to add/remove admin access without code changes
✅ **Scalable**: Can manage multiple admins easily

## Alternative: Using Preferences

If you prefer using preferences instead of labels, you can modify `useAuth.tsx`:

```typescript
// Check user preferences instead of labels
setIsAdmin(currentUser.prefs?.role === 'admin');
```

**Pros of Preferences:**
- Can be updated by the user if you allow it
- More flexible data structure (JSON object)

**Cons of Preferences:**
- Less secure (users can modify their own prefs)
- Requires more setup

**Recommendation:** Stick with labels for admin roles.
