-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2026 at 08:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appify-task-project`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-0fc6759f1a3e89e8d4bee17a3b1438cd', 'i:4;', 1775403270),
('laravel-cache-0fc6759f1a3e89e8d4bee17a3b1438cd:timer', 'i:1775403270;', 1775403270),
('laravel-cache-356a192b7913b04c54574d18c28d46e6395428ab', 'i:1;', 1775414520),
('laravel-cache-356a192b7913b04c54574d18c28d46e6395428ab:timer', 'i:1775414520;', 1775414520),
('laravel-cache-60f581ff5278444c2368fef24e2b2075', 'i:3;', 1775414522),
('laravel-cache-60f581ff5278444c2368fef24e2b2075:timer', 'i:1775414522;', 1775414522);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `post_id`, `parent_id`, `content`, `created_at`, `updated_at`) VALUES
(22, 1, 53, NULL, 'hello', '2026-04-05 12:24:42', '2026-04-05 12:24:42'),
(23, 1, 53, 22, '@Sunny hi', '2026-04-05 12:24:46', '2026-04-05 12:24:46');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `likeable_type` varchar(255) NOT NULL,
  `likeable_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `user_id`, `likeable_type`, `likeable_id`, `created_at`, `updated_at`) VALUES
(3, 1, 'App\\Models\\Post', 1, '2026-04-05 07:52:31', '2026-04-05 07:52:31'),
(4, 1, 'App\\Models\\Post', 2, '2026-04-05 07:56:54', '2026-04-05 07:56:54'),
(5, 2, 'App\\Models\\Post', 2, '2026-04-05 08:02:02', '2026-04-05 08:02:02'),
(7, 2, 'App\\Models\\Comment', 5, '2026-04-05 08:17:24', '2026-04-05 08:17:24'),
(8, 1, 'App\\Models\\Comment', 13, '2026-04-05 08:43:11', '2026-04-05 08:43:11'),
(10, 2, 'App\\Models\\Comment', 17, '2026-04-05 09:33:39', '2026-04-05 09:33:39'),
(11, 1, 'App\\Models\\Comment', 18, '2026-04-05 09:33:58', '2026-04-05 09:33:58'),
(12, 1, 'App\\Models\\Comment', 20, '2026-04-05 09:38:13', '2026-04-05 09:38:13'),
(15, 1, 'App\\Models\\Comment', 15, '2026-04-05 12:23:57', '2026-04-05 12:23:57'),
(16, 1, 'App\\Models\\Comment', 16, '2026-04-05 12:24:00', '2026-04-05 12:24:00'),
(17, 1, 'App\\Models\\Post', 52, '2026-04-05 12:24:04', '2026-04-05 12:24:04'),
(18, 1, 'App\\Models\\Post', 53, '2026-04-05 12:24:38', '2026-04-05 12:24:38'),
(19, 1, 'App\\Models\\Comment', 22, '2026-04-05 12:24:49', '2026-04-05 12:24:49'),
(20, 1, 'App\\Models\\Comment', 23, '2026-04-05 12:24:49', '2026-04-05 12:24:49');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_03_31_150257_create_personal_access_tokens_table', 1),
(5, '2026_03_31_154806_create_posts_table', 1),
(6, '2026_03_31_180239_create_likes_table', 1),
(7, '2026_03_31_180257_create_comments_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 2, 'auth_token', '971db0796c3e442239a83e6341dc2a23720895caa3aef17743be0f7a61bf3dc0', '[\"*\"]', NULL, NULL, '2026-04-05 08:00:14', '2026-04-05 08:00:14'),
(5, 'App\\Models\\User', 1, 'auth_token', 'ff44df6b4910d34f45b8e42e47e836c4f80ae87c29adcee08107f085e43dd8c7', '[\"*\"]', NULL, NULL, '2026-04-05 12:41:01', '2026-04-05 12:41:01');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `content` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `likes_count` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `comments_count` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `visibility` enum('public','private') NOT NULL DEFAULT 'public',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `content`, `image`, `likes_count`, `comments_count`, `visibility`, `created_at`, `updated_at`) VALUES
(53, 1, 'Hii', NULL, 1, 2, 'public', '2026-04-05 12:24:35', '2026-04-05 12:24:46'),
(54, 3, 'This is post number 1. CmQhMAa2tdA9Vv0kQBHFj3oTCgCAwcuANMGXO5twaFyY1YBc3v', 'posts/post_NQGDI5uu8B_1775413538.jpg', 0, 0, 'public', '2026-04-05 11:36:40', '2026-04-05 12:25:40'),
(55, 3, 'This is post number 2. eljKwP5b8UTeqwRRTqYIuModZKQNNtteBYq3uMV3zQf8By93oq', 'posts/post_DB49mnz2gM_1775413540.jpg', 0, 0, 'public', '2026-04-05 11:37:42', '2026-04-05 12:25:42'),
(56, 3, 'This is post number 3. WeSDDi7hhnxliyscq6DYAQz6EhphNcwaMhYcfQt4sIixMIZtF5', 'posts/post_Lw6ci6SoWF_1775413542.jpg', 0, 0, 'public', '2026-04-05 11:38:44', '2026-04-05 12:25:44'),
(57, 3, 'This is post number 4. RvT0Dv5Zm4ONMB4ewrrbzISxFDjmw5ismVoNfABpnEAQwRnZD4', 'posts/post_jPlcUJXSPx_1775413544.jpg', 0, 0, 'public', '2026-04-05 11:39:46', '2026-04-05 12:25:46'),
(58, 3, 'This is post number 5. ZbXco1EJ1mYNbBXNajDPg08Wrd9yHxsuQx6sKptcGhd558OiYt', 'posts/post_JIQKsP9HxU_1775413546.jpg', 0, 0, 'public', '2026-04-05 11:40:48', '2026-04-05 12:25:48'),
(59, 3, 'This is post number 6. xTCQ9l4Rt8gVfqebZjO6Z96nduyqxtWzO6YoUAVG6bfcMKBvQt', 'posts/post_UexW5nWnPo_1775413548.jpg', 0, 0, 'public', '2026-04-05 11:41:50', '2026-04-05 12:25:50'),
(60, 3, 'This is post number 7. 3MzRRXaN7foFuRhxkHymE3qr1cc03BcGW6PKl27uh7DMuIcwXG', 'posts/post_6jXA6eCbLL_1775413550.jpg', 0, 0, 'public', '2026-04-05 11:42:52', '2026-04-05 12:25:52'),
(61, 3, 'This is post number 8. uDnCCRHoaLWgca97RXqIs9zE5XS22TEPX0Ip6fjIXTIpfLAsLx', 'posts/post_hw7sjIvWhA_1775413552.jpg', 0, 0, 'public', '2026-04-05 11:43:54', '2026-04-05 12:25:54'),
(62, 3, 'This is post number 9. Wt2V5afsWJtsxKDpETli8zDQrePffVEtzV9ip7GxIsqVDNlBdg', 'posts/post_QleGXa5Eof_1775413554.jpg', 0, 0, 'public', '2026-04-05 11:44:56', '2026-04-05 12:25:56'),
(63, 3, 'This is post number 10. D5uws5nmhSKtE0eXFCbSh6zFh4xtvfSpNb6d0QoH7RBIkLXIu4', 'posts/post_JtO9G6SyaN_1775413556.jpg', 0, 0, 'public', '2026-04-05 11:45:59', '2026-04-05 12:25:59'),
(64, 3, 'This is post number 11. 4mL0gN8TJlGR7hQSBKY2TDmAXufV69xQJpSVVsJqILJMYNANMt', 'posts/post_ScXuMIiVum_1775413559.jpg', 0, 0, 'public', '2026-04-05 11:47:00', '2026-04-05 12:26:00'),
(65, 3, 'This is post number 12. oLQ8b8qHRpdFvuLqCcFwsIbC9PhreZjPV0P9bivwi2sN10p8D4', 'posts/post_aIHfzFmZhh_1775413560.jpg', 0, 0, 'public', '2026-04-05 11:48:02', '2026-04-05 12:26:02'),
(66, 3, 'This is post number 13. nXLXYNonxRwLgKioZeYnVH17h9ZZqiV1KoRBpzV3uZZAnF8rKI', 'posts/post_BkftC3MDZf_1775413562.jpg', 0, 0, 'public', '2026-04-05 11:49:04', '2026-04-05 12:26:04'),
(67, 3, 'This is post number 14. dnzZcCdxFDxLPrU13P7mtp8nvSl8rjBHfEqwN0Z9ShB81Ub6oG', 'posts/post_Yy4oAr66qI_1775413564.jpg', 0, 0, 'public', '2026-04-05 11:50:06', '2026-04-05 12:26:06'),
(68, 3, 'This is post number 15. PqXc5rxudZ9X7hM3sd44R7dSwv43lAYSQit4aic56QxWDoOHkN', 'posts/post_qndtHbGtBp_1775413566.jpg', 0, 0, 'public', '2026-04-05 11:51:08', '2026-04-05 12:26:08'),
(69, 3, 'This is post number 16. Y7m0luya0jhyJjgRQLC8KCxOPWrfQ7aNSVNdkOIvXWOOUUzD11', 'posts/post_diFpWLxw9F_1775413568.jpg', 0, 0, 'public', '2026-04-05 11:52:10', '2026-04-05 12:26:10'),
(70, 3, 'This is post number 17. pUPqfRnjCyWgS2V8my2Ow8j4sKDMBHlWvzru6ItowcLn9FmXOg', 'posts/post_W8zqJtiOGn_1775413570.jpg', 0, 0, 'public', '2026-04-05 11:53:12', '2026-04-05 12:26:12'),
(71, 3, 'This is post number 18. 2yZZuU9rDsDUnHFqiG9S5VCSRQwp2krzPCiKjd2A5nBNdeDfjr', 'posts/post_w1C7rmdet3_1775413572.jpg', 0, 0, 'public', '2026-04-05 11:54:14', '2026-04-05 12:26:14'),
(72, 3, 'This is post number 19. frzVzU4KgHgIju6K3yRkWPkKFyqibpFsoMX64zZ8X9atJBAxrV', 'posts/post_Vawx5c4FDX_1775413574.jpg', 0, 0, 'public', '2026-04-05 11:55:15', '2026-04-05 12:26:15'),
(73, 3, 'This is post number 20. ybsTrlAXGSVH2TgTRWMgk8nUfaA9ymlVnB7GA83DRoeAPJiWLW', 'posts/post_yNoIJq7wpa_1775413575.jpg', 0, 0, 'public', '2026-04-05 11:56:17', '2026-04-05 12:26:17'),
(74, 3, 'This is post number 21. xZiVLfvj0g0avHVONlKePZfSmS9SOPWRenvwLubMIdi0YkmRiV', 'posts/post_NyVtR10ztW_1775413577.jpg', 0, 0, 'public', '2026-04-05 11:57:18', '2026-04-05 12:26:18'),
(75, 3, 'This is post number 22. W0ovNYa2BRh31HNLPWy8Ypzm1WoVon5VQBqreByoa1HEdTtQ4v', 'posts/post_2MeqYrlgDa_1775413578.jpg', 0, 0, 'public', '2026-04-05 11:58:20', '2026-04-05 12:26:20'),
(76, 3, 'This is post number 23. enCWzmXxPEGH6Eb8jZrskb2geNfLptvQ3mtHHkFqiVpJE6iocH', 'posts/post_E9vAn6A4Df_1775413580.jpg', 0, 0, 'public', '2026-04-05 11:59:22', '2026-04-05 12:26:22'),
(77, 3, 'This is post number 24. gS4hMFuZNWtf5rGQJNcsPJT3a0KQKyRRfOrYI3mdAVJwZwzl5e', 'posts/post_YpMlSVFceY_1775413582.jpg', 0, 0, 'public', '2026-04-05 12:00:23', '2026-04-05 12:26:23'),
(78, 3, 'This is post number 25. TrRNKbky8fD3VRx4rM9UD13E1rylL9xVhPzFWSCBsJYfCn85wd', 'posts/post_DyLkoXlos1_1775413583.jpg', 0, 0, 'public', '2026-04-05 12:01:25', '2026-04-05 12:26:25'),
(79, 3, 'This is post number 26. 1B2T8FkSHXUcJh8o2q6hcm6LeOeczNMy3AES47ni6fIjZ05yyZ', 'posts/post_SFi7eiEVu9_1775413585.jpg', 0, 0, 'public', '2026-04-05 12:02:28', '2026-04-05 12:26:28'),
(80, 3, 'This is post number 27. hX0rjp2DMKoUcYYd4VDbAbFZXHss3HX1Yme0IZkOwqNMkRwDkB', 'posts/post_PMMrKLwRTJ_1775413588.jpg', 0, 0, 'public', '2026-04-05 12:03:29', '2026-04-05 12:26:29'),
(81, 3, 'This is post number 28. H5aHd9y3RcyJFef2RojddUUaBTHPsLyfpMNS82i1AjtB3aR06y', 'posts/post_vYb2KX7P3m_1775413590.jpg', 0, 0, 'public', '2026-04-05 12:04:31', '2026-04-05 12:26:31'),
(82, 3, 'This is post number 29. 6WKgoZX3Gk8rsLPxXy737hXHxUnonrbMnF5xfKDSlsTwk74AX8', 'posts/post_4cDHVoalCQ_1775413591.jpg', 0, 0, 'public', '2026-04-05 12:05:33', '2026-04-05 12:26:33'),
(83, 3, 'This is post number 30. FmzDGSNWzoNjZQwBEhqruSJ3PkBLK6Z6LJ3ECKdGgwx0PjIEgg', 'posts/post_gOoQgxOOjh_1775413593.jpg', 0, 0, 'public', '2026-04-05 12:06:34', '2026-04-05 12:26:34'),
(84, 3, 'This is post number 31. 9WNGwbK5Jrbp2fD2DwpBWN6O912ffxOUaXarBQq7I7Q6jDond0', 'posts/post_kz4RNblQMh_1775413594.jpg', 0, 0, 'public', '2026-04-05 12:07:36', '2026-04-05 12:26:36'),
(85, 3, 'This is post number 32. gVH9AsN48658czjTdw81WhhQsOQvMwK73BNxbYoCKZycmLj0O9', 'posts/post_8mbiIfqkIk_1775413596.jpg', 0, 0, 'public', '2026-04-05 12:08:38', '2026-04-05 12:26:38'),
(86, 3, 'This is post number 33. RPR6cOuq6np9XUFAZDALB0ynXbWpEs9sP4OOExXzTlMLaU3c0l', 'posts/post_iDjFdmJJCg_1775413598.jpg', 0, 0, 'public', '2026-04-05 12:09:40', '2026-04-05 12:26:40'),
(87, 3, 'This is post number 34. v2sjpiPnIwtgEDrm22p1vhZzMfDMPdRiWqQsdhoEE4aPhi0lES', 'posts/post_qBa69dinyO_1775413600.jpg', 0, 0, 'public', '2026-04-05 12:10:42', '2026-04-05 12:26:42'),
(88, 3, 'This is post number 35. VC992aFwXQ3CIHsJeQ69VdKTm2nieM8IRGllVUgltakAaveUpL', 'posts/post_NPIZtWxkfb_1775413602.jpg', 0, 0, 'public', '2026-04-05 12:11:44', '2026-04-05 12:26:44'),
(89, 3, 'This is post number 36. AVTZd9sC3ySo9ixtRW1584tjIu5UkYoDPXKoM7f1M9qgAHa29h', 'posts/post_0401kYx4aW_1775413604.jpg', 0, 0, 'public', '2026-04-05 12:12:45', '2026-04-05 12:26:45'),
(90, 3, 'This is post number 37. BKBi7wLfzAeF26kVwnJCnx2k9DuaPIlVMKFKf97gcfMWCdbcwn', 'posts/post_vpX1xEM1Nx_1775413605.jpg', 0, 0, 'public', '2026-04-05 12:13:47', '2026-04-05 12:26:47'),
(91, 3, 'This is post number 38. BT2wERSXE6dOhbrPmJLHG0YYaT68bGPGQwa0R89ChV9zpdFYi1', 'posts/post_5aGRFtQWpi_1775413607.jpg', 0, 0, 'public', '2026-04-05 12:14:48', '2026-04-05 12:26:48'),
(92, 3, 'This is post number 39. CkhJ9cznL9vJPSK8FrrcbzLapx9TWi8DtsNBgoYNPQ6w8P3A0K', 'posts/post_p6rFGDCLvj_1775413608.jpg', 0, 0, 'public', '2026-04-05 12:15:52', '2026-04-05 12:26:52'),
(93, 3, 'This is post number 40. cpEs0ONgrOh78LqKMJUBCRNFl8NFnsWBoJxUMueif7F53i9lOf', 'posts/post_MQxhdhL3vt_1775413612.jpg', 0, 0, 'public', '2026-04-05 12:16:54', '2026-04-05 12:26:54'),
(94, 3, 'This is post number 41. iHvDVq19ZFk6Tm9yD7j9uqu4YbQovnr0RzWjmNOJeEvkS3XJXQ', 'posts/post_QZPzwzlYQS_1775413614.jpg', 0, 0, 'public', '2026-04-05 12:17:56', '2026-04-05 12:26:56'),
(95, 3, 'This is post number 42. Dj4v68De9kRasByoe8YGpxqcy9Q5AYl6cZfi0Md6vezs0CrkKV', 'posts/post_wk73X4afpK_1775413616.jpg', 0, 0, 'public', '2026-04-05 12:18:57', '2026-04-05 12:26:57'),
(96, 3, 'This is post number 43. n85eRY0Fi3fvOWtHqoYH7EHfpcmcTFpWPSslBekRFDIKVnUYwo', 'posts/post_2MqFjvDk28_1775413617.jpg', 0, 0, 'public', '2026-04-05 12:19:59', '2026-04-05 12:26:59'),
(97, 3, 'This is post number 44. zj80hLMRvqXiJEM9QJKjZ4yi5TgrMI5a4fiOvZ4xfcH3uDWsvj', 'posts/post_0kpoSbxU8W_1775413619.jpg', 0, 0, 'public', '2026-04-05 12:21:00', '2026-04-05 12:27:00'),
(98, 3, 'This is post number 45. piOaj28mbWyrk5QipbFtZldWRak36vYbAm0q78GUbqFZi7bhOg', 'posts/post_mi5ap8oVqo_1775413620.jpg', 0, 0, 'public', '2026-04-05 12:22:02', '2026-04-05 12:27:02'),
(99, 3, 'This is post number 46. oRvvvyUP4FFeY0zoHorQLVAEibs7I76nIIZohpvcHAtMwe2eLp', 'posts/post_pbKBEcVRHK_1775413622.jpg', 0, 0, 'public', '2026-04-05 12:23:03', '2026-04-05 12:27:03'),
(100, 3, 'This is post number 47. OsM8m3chgLvVXvtDn3EtFoLt0kvX652VgBwVCq5Qja0ldvXMnN', 'posts/post_MfW0hsdtdy_1775413623.jpg', 0, 0, 'public', '2026-04-05 12:24:05', '2026-04-05 12:27:05'),
(101, 3, 'This is post number 48. MYeAuBf891FxPAXShSzk5hQ4drhvZ0Cthc4mPKxGNATXsS30hG', 'posts/post_kZPfqOrStS_1775413625.jpg', 0, 0, 'public', '2026-04-05 12:25:06', '2026-04-05 12:27:06'),
(102, 3, 'This is post number 49. ugEthMoV8O6IBthpmKUCyfS1jvZSDLpA9fzNnMlKppuPCvSICs', 'posts/post_AaCrdyyLiu_1775413626.jpg', 0, 0, 'public', '2026-04-05 12:26:08', '2026-04-05 12:27:08'),
(103, 3, 'This is post number 50. DRtUbV0iMnTuS8EclDqbReqMtYKxE94pDxxfZUHx2i1t3yCQkx', 'posts/post_4tJL1e0avK_1775413628.jpg', 0, 0, 'public', '2026-04-05 12:27:10', '2026-04-05 12:27:10');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Sunny', 'Nath', 'debnathsunny7852@gmail.com', NULL, '$2y$12$QLEAjKEBsDX3z59dIeX7IemJI8a2/5RkSBT0xaC19JV8eT/RnAx/m', NULL, '2026-04-05 07:49:44', '2026-04-05 07:49:44'),
(2, 'deb', 'sunny', 'debsunny7852@gmail.com', NULL, '$2y$12$yEG1toP82QMZVV4VBjPirehMqxm8Kc72XEvltITRKy4ezTVvr3iGy', NULL, '2026-04-05 07:56:39', '2026-04-05 07:56:39'),
(3, 'Deb Brotho', 'Nath Sunny', 'test@example.com', NULL, '$2y$12$WvxvVs0ZXQjBdch8eHJeruiKRgGOlkHoBxC3jJFdrl65LKO6w4Q4K', NULL, '2026-04-05 08:03:49', '2026-04-05 08:03:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comments_user_id_index` (`user_id`),
  ADD KEY `comments_post_id_index` (`post_id`),
  ADD KEY `comments_parent_id_index` (`parent_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `likes_user_id_likeable_id_likeable_type_unique` (`user_id`,`likeable_id`,`likeable_type`),
  ADD KEY `likes_likeable_type_likeable_id_index` (`likeable_type`,`likeable_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `posts_user_id_foreign` (`user_id`),
  ADD KEY `posts_visibility_created_at_user_id_index` (`visibility`,`created_at`,`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
