-- Task 5: Transaction-Based Payment Simulation
-- Process: Deduct balance from user account, Add amount to merchant account.
-- Features: COMMIT on success, ROLLBACK on failure.

-- =====================================
-- Scenario 1: SUCCESSFUL TRANSFER
-- =====================================

-- 1. Start the transaction block
START TRANSACTION;

-- 2. Deduct $150 from User
UPDATE accounts 
SET balance = balance - 150.00 
WHERE account_type = 'user';

-- 3. Add $150 to Merchant
UPDATE accounts 
SET balance = balance + 150.00 
WHERE account_type = 'merchant';

-- Both queries executed without errors, commit the changes to disk.
COMMIT;


-- =====================================
-- Scenario 2: FAILED TRANSFER (Network Drop)
-- =====================================

-- 1. Start the transaction block
START TRANSACTION;

-- 2. Deduct $150 from User
UPDATE accounts 
SET balance = balance - 150.00 
WHERE account_type = 'user';

-- System crash or database connection fails before updating Merchant!
-- ...
-- Server issues ROLLBACK to undo the User deduction and maintain financial accuracy.
ROLLBACK;
