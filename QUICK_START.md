# Quick Start - Using New Constants

## Import Constants

```typescript
import { LABELS, MESSAGES, ROUTES, STORAGE_KEYS } from '@/constants';
```

## Usage Examples

### UI Labels
```typescript
// Page titles
<h1>{LABELS.AUTH.LOGIN_TITLE}</h1>
<h2>{LABELS.FLIGHTS.PAGE_TITLE}</h2>

// Buttons
<Button>{LABELS.AUTH.LOGIN_BUTTON}</Button>
<Button>{LABELS.FLIGHTS.SEARCH_BUTTON}</Button>

// Form fields
<Input label={LABELS.AUTH.EMAIL} />
<Input label={LABELS.AUTH.PASSWORD} />
```

### Messages
```typescript
// Success messages
toast.success(MESSAGES.AUTH.REGISTER_SUCCESS);
toast.success(MESSAGES.RESERVATIONS.CREATE_SUCCESS);

// Error messages
toast.error(MESSAGES.AUTH.LOGIN_ERROR);
toast.error(MESSAGES.FLIGHTS.SEARCH_ERROR);

// Info messages
toast(MESSAGES.FLIGHTS.NO_RESULTS);
```

### Routes
```typescript
// Navigation
navigate(ROUTES.LOGIN);
navigate(ROUTES.FLIGHTS);
navigate(ROUTES.RESERVATIONS);

// Links
<Link to={ROUTES.REGISTER}>Register</Link>
<Link to={ROUTES.FORGOT_PASSWORD}>Forgot Password</Link>
```

### Storage Keys
```typescript
// Get from localStorage
const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
const user = localStorage.getItem(STORAGE_KEYS.USER);

// Set to localStorage
localStorage.setItem(STORAGE_KEYS.TOKEN, token);
localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

// Remove from localStorage
localStorage.removeItem(STORAGE_KEYS.TOKEN);
```

## Constants Reference

| File | Purpose | Example |
|------|---------|---------|
| `labels.ts` | UI text | `LABELS.AUTH.LOGIN_TITLE` |
| `messages.ts` | User messages | `MESSAGES.AUTH.LOGIN_ERROR` |
| `routes.ts` | App routes | `ROUTES.FLIGHTS` |
| `storage.ts` | localStorage keys | `STORAGE_KEYS.TOKEN` |

## More Details

See **REFACTORING_SUMMARY.md** for complete implementation guide.

## Key Points

✅ All constants are type-safe  
✅ Easy to find with IDE autocomplete  
✅ Consistent across the app  
✅ Ready for internationalization  
✅ Professional code structure
