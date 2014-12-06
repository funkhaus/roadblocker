<div class="wrap roadblocker-options">
	<h2>Roadblocker Options</h2>

	<form action="options.php" method="post">

		<?php
			// Output required WP settings fields
			settings_fields('roadblocker_settings');				
			
			// Get any/all files in theme/roadblocks/*.php
			$templates = glob(get_stylesheet_directory().'/roadblocks/*.php');
		?>
		
		<table class="form-table">
			<tbody>
				
				<tr valign="top">
					<th scope="row"><label>Disable roadblock after clicking close</label></th>
					<td>
						<input name="roadblocker_close_count" class="small-text" min="1" type="number" value="<?php echo get_option('roadblocker_close_count', 3); ?>"> times
					</td>
				</tr>
				
				<tr valign="top">
					<th scope="row"><label>Show disabled roadblock again after</label></th>
					<td>
						<input name="roadblocker_close_days_count" type="number" class="small-text" min="1" value="<?php echo get_option('roadblocker_close_days_count', 30); ?>"> days
					</td>
				</tr>
				
				<tr valign="top">
					<th scope="row"><label>After submit, show roadblock again after</label></th>
					<td>
						<input name="roadblocker_submit_days_count" type="number" class="small-text" min="1" value="<?php echo get_option('roadblocker_submit_days_count', 365); ?>"> days
					</td>
				</tr>
				
				<tr valign="top">
					<th scope="row"><label>Show the roadblock on</label></th>
					<td>
						<?php
							$location = get_option('roadblocker_overlay_location');
						?>
						<select name="roadblocker_overlay_location">
							<option value="is_home" <?php selected( $location, 'is_home'); ?>>Home Page</option>			
							<option value="is_front_page" <?php selected( $location, 'is_front_page'); ?>>Front Page</option>
							<option value="is_singular" <?php selected( $location, 'is_singular'); ?>>Singular Page/Post</option>
							<option value="second_page" <?php selected( $location, 'second_page'); ?>>2nd page visited</option>
							<option value="any" <?php selected( $location, 'any'); ?>>Any page/post</option>
						</select>
					</td>

				</tr>
				
				<tr valign="top">
					<th scope="row"><label>Use template </label></th>
					<td>
						<?php if( !empty($templates) ) : ?>
							<select name="roadblocker_template">

								<option value="none" <?php selected( get_option('roadblocker_template'), 'none'); ?> >None</option>
								
								<?php foreach ( $templates as $path ) : ?>
									<?php $filename = basename($path, '.php'); ?>
									<option value="<?php echo $filename; ?>" <?php selected( get_option('roadblocker_template'), $filename); ?>><?php echo $filename; ?></option>
								<?php endforeach; ?>
							</select>
						<?php else : ?>
							<p class="description">You need to add a template in your theme directory (eg: twentyfourteen/roadblocks/mailinglist.php).</p>
						<?php endif; ?>
					</td>
				</tr>


				<tr valign="top">
					<th scope="row"><label>Reset tracking for active template</label></th>
					<td>
						<?php
							$reset_tracking = get_option('roadblocker_reset_tracking', 0);
						?>
						<fieldset>
							<p>
								<label><input type="checkbox" name="roadblocker_reset_tracking" value="1">Yes</label><br>
							</p>
							<p class="description">This will reset tracking for the active template only.</p>
						</fieldset>
		
					</td>
				</tr>
								

				<tr valign="top">
					<th scope="row"><label>Force roadblock on</label></th>
					<td>
						<?php
							$force_display = get_option('roadblocker_force_display', 0);
						?>
						<fieldset>
							<p>
								<label><input type="radio" name="roadblocker_force_display" value="0" <?php checked( $force_display, 0 ); ?>>No</label><br>
								<label><input type="radio" name="roadblocker_force_display" value="1" <?php checked( $force_display, 1 ); ?>>Yes</label>
							</p>
							<p class="description">This will disable tracking, the roadblock will be shown regardless of existing cookie states.</p> 
							<p class="description">Useful for testing or high traffic days.</p>
						</fieldset>
					</td>
				</tr>

			</tbody>
		</table>		
		
		<?php submit_button(); ?>
		
	</form>
	
	
</div>