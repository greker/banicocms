using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq.Expressions;
using System;
using Banico.Core.Entities;
using Banico.Core.Repositories;
using Microsoft.Extensions.Configuration;

namespace Banico.EntityFrameworkCore.Repositories
{
    public class SectionItemRepository : ISectionItemRepository
    {
        public AppDbContext DbContext { get; set; }
        private string _tenantRegEx = string.Empty;

        private const char PATH_DELIM = '_';
        private const char TYPE_DELIM = '~';
        private const char SECTION_DELIM = '*';

        public SectionItemRepository(
            AppDbContext dbContext,
            IConfiguration configuration)
        {
            this.DbContext = dbContext;
            _tenantRegEx = configuration["TenantRegEx"];
        }

        public void ParsePath(
            string inputPathUrl, 
            out string[] types, 
            out string[] pathUrls, 
            out string[] aliases)
        {
            List<string> typeList = new List<string>();
            List<string> pathList = new List<string>();
            List<string> aliasList = new List<string>();

            if (!string.IsNullOrEmpty(inputPathUrl))
            {
                string[] sectionItems = inputPathUrl.Split(SECTION_DELIM);

                foreach (string sectionItem in sectionItems)
                {
                    string[] typePathItems = sectionItem.Split(TYPE_DELIM);

                    typeList.Add(typePathItems[0]);

                    string[] pathItems = typePathItems[1].Split(PATH_DELIM);

                    aliasList.Add(pathItems[pathItems.Length - 1]);

                    string currentPathUrl = string.Empty;
                    for (int i = 0; i < pathItems.Length - 1; i++)
                    {
                        if (!string.IsNullOrEmpty(currentPathUrl))
                        {
                            currentPathUrl = currentPathUrl + PATH_DELIM;
                        }
                        currentPathUrl = currentPathUrl + pathItems[i];
                    }
                    pathList.Add(currentPathUrl);
                }
            }

            types = typeList.ToArray();
            pathUrls = pathList.ToArray();
            aliases = aliasList.ToArray();
        }

        public async Task<List<SectionItem>> Get(
            string tenant,
            string id,
            string section,
            string pathUrl,
            string alias,
            string name,
            string parentId,
            bool isRoot)
        {
            var sectionItems = from s in this.DbContext.SectionItems
                where 
                    (s.Id == id || string.IsNullOrEmpty(id)) &&
                    (s.Section == section || string.IsNullOrEmpty(section)) && 
                    (s.PathUrl == pathUrl || string.IsNullOrEmpty(pathUrl)) && 
                    (s.Alias == alias || string.IsNullOrEmpty(alias)) &&
                    (s.Name == name || string.IsNullOrEmpty(name)) && 
                    (s.ParentId == parentId || string.IsNullOrEmpty(parentId)) &&
                    (s.ParentId == string.Empty || !isRoot) &&
                    (s.Tenant == tenant || string.IsNullOrEmpty(tenant))
                select s;

            return await sectionItems.ToListAsync();
        }

        public async Task<SectionItem> AddOrUpdate(SectionItem sectionItem, bool isSectionItemAdmin)
        {
            if (string.IsNullOrEmpty(sectionItem.Id)) 
            {
                return await this.Add(sectionItem, isSectionItemAdmin);
            }
            else
            {
                return await this.Update(sectionItem, isSectionItemAdmin);
            }
        }

        public async Task<SectionItem> Add(SectionItem sectionItem, bool isSectionItemAdmin)
        {
            if (!isSectionItemAdmin)
            {
                return new SectionItem();
            }

            sectionItem.Id = Guid.NewGuid().ToString();
            this.DbContext.SectionItems.Add(sectionItem);
            var result = await this.DbContext.SaveChangesAsync();

            if (result > 0)
            {
                return sectionItem;
            }

            return new SectionItem();
        }

        // Update(item, i => i.Title)
        // Returns no. of objects saved
        public async Task<SectionItem> Update(SectionItem sectionItem, bool isSectionItemAdmin)
        {
            if (!isSectionItemAdmin)
            {
                return new SectionItem();
            }

            var storedSectionItem = (await this.Get(
                string.Empty, sectionItem.Id, string.Empty, string.Empty, string.Empty,
                string.Empty, string.Empty, false))
                .FirstOrDefault();

            if (storedSectionItem != null)
            {
                storedSectionItem.Name = sectionItem.Name;
                storedSectionItem.Alias = sectionItem.Alias;
                storedSectionItem.Description = sectionItem.Description;
                storedSectionItem.UpdatedBy = sectionItem.UpdatedBy;
                storedSectionItem.UpdatedDate = sectionItem.UpdatedDate;
                
                var result = await this.DbContext.SaveChangesAsync();

                if (result > 0)
                {
                    return sectionItem;
                }
            }

            return new SectionItem();
        }

        public async Task<SectionItem> Delete(string id, bool isSectionItemAdmin)
        {
            if (!isSectionItemAdmin)
            {
                return new SectionItem();
            }

            var sectionItem = (await this.Get(
                string.Empty, id, string.Empty, string.Empty, string.Empty,
                string.Empty, string.Empty, false))
                .FirstOrDefault();

            this.DbContext.Remove(sectionItem);
            var result = await this.DbContext.SaveChangesAsync();

            if (result > 0)
            {
                return sectionItem;
            }

            return new SectionItem();
        }
    }
}